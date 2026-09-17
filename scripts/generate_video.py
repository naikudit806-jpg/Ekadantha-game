"""
EKADANTHA: Video Asset & Package Generator
Creates a valid WebM video file container for assets/video/intro_cinematic.webm
"""
import os
import struct

def make_vint(val):
    """Encode an integer as a Matroska Variable Size Integer (EBML VINT)."""
    if val < 0:
        raise ValueError("VINT value must be non-negative")
    for length in range(1, 9):
        max_val = (1 << (7 * length)) - 1
        if val <= max_val:
            mask = 1 << (8 * length - length)
            combined = mask | val
            return combined.to_bytes(length, byteorder='big')
    raise ValueError("Value too large for VINT")

def make_element(elem_id, data):
    """Create an EBML element with ID and data."""
    id_bytes = elem_id.to_bytes((elem_id.bit_length() + 7) // 8, byteorder='big')
    len_bytes = make_vint(len(data))
    return id_bytes + len_bytes + data

def generate_minimal_webm(output_path, width=640, height=360, duration_sec=45):
    """
    Constructs a structurally valid WebM container with EBML header, Tracks, and Clusters.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 1. EBML Header
    ebml_body = b''.join([
        make_element(0x4286, (1).to_bytes(1, 'big')),        # EBMLVersion = 1
        make_element(0x42F7, (1).to_bytes(1, 'big')),        # EBMLReadVersion = 1
        make_element(0x42F2, (4).to_bytes(1, 'big')),        # EBMLMaxIDLength = 4
        make_element(0x42F3, (8).to_bytes(1, 'big')),        # EBMLMaxSizeLength = 8
        make_element(0x4282, b'webm'),                       # DocType = "webm"
        make_element(0x4287, (2).to_bytes(1, 'big')),        # DocTypeVersion = 2
        make_element(0x4285, (2).to_bytes(1, 'big')),        # DocTypeReadVersion = 2
    ])
    ebml_header = make_element(0x1A45DFA3, ebml_body)
    
    # 2. Segment Info
    info_body = b''.join([
        make_element(0x2AD7B1, (1000000).to_bytes(4, 'big')), # TimecodeScale = 1,000,000 ns (1 ms)
        make_element(0x4489, struct.pack('>f', float(duration_sec * 1000))), # Duration
        make_element(0x4D80, b'EKADANTHA Cinematic Engine'), # MuxingApp
        make_element(0x5741, b'EKADANTHA Video Muxer'),       # WritingApp
    ])
    segment_info = make_element(0x1549A966, info_body)
    
    # 3. Video Track
    video_settings = b''.join([
        make_element(0xB0, width.to_bytes(2, 'big')),        # PixelWidth
        make_element(0xBA, height.to_bytes(2, 'big')),       # PixelHeight
    ])
    
    track_entry = b''.join([
        make_element(0xD7, (1).to_bytes(1, 'big')),           # TrackNumber = 1
        make_element(0x73C5, (1).to_bytes(1, 'big')),         # TrackUID = 1
        make_element(0x83, (1).to_bytes(1, 'big')),           # TrackType = 1 (Video)
        make_element(0x86, b'V_VP8'),                         # CodecID = "V_VP8"
        make_element(0xE0, video_settings),                   # VideoSettings
    ])
    tracks = make_element(0x1654AE6B, make_element(0xAE, track_entry))
    
    # 4. Synthesize VP8 Keyframe Data
    # 3 bytes uncompressed header: keyframe (0), version (0), show (1), part size
    # 3 bytes start code: 0x9D 0x01 0x2A
    # 2 bytes width (low 14 bits), 2 bytes height (low 14 bits)
    vp8_header = byteorder = struct.pack('<BBB', 0x00, 0x00, 0x00) # frame tag
    vp8_start_code = b'\x9d\x01\x2a'
    vp8_dims = struct.pack('<HH', width & 0x3FFF, height & 0x3FFF)
    # Simple empty boolean entropy partition
    vp8_payload = vp8_header + vp8_start_code + vp8_dims + b'\x00' * 64
    
    # SimpleBlock: Track 1 (0x81), Timecode (0x0000, 16-bit signed), Flags (0x80 = Keyframe)
    block_header = b'\x81\x00\x00\x80'
    simple_block = make_element(0xA3, block_header + vp8_payload)
    
    clusters = []
    # Create clusters spanning the duration
    for sec in range(0, duration_sec, 2):
        cluster_timecode = make_element(0xE7, int(sec * 1000).to_bytes(4, 'big'))
        cluster = make_element(0x1F43B675, cluster_timecode + simple_block)
        clusters.append(cluster)
        
    segment_body = segment_info + tracks + b''.join(clusters)
    segment = make_element(0x18538067, segment_body)
    
    with open(output_path, 'wb') as f:
        f.write(ebml_header + segment)
        
    print(f"[Video Generator] Successfully generated {output_path} ({len(ebml_header + segment)} bytes, {duration_sec}s)")

if __name__ == '__main__':
    video_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'video', 'intro_cinematic.webm')
    generate_minimal_webm(video_path, width=640, height=360, duration_sec=59)
