import os
from PIL import Image

def convert_to_webp(input_path, output_path, max_dimension=1080):
    print(f"Converting {input_path}...")
    try:
        img = Image.open(input_path)
        
        # Calculate aspect ratio preserving scale
        ratio = min(max_dimension / img.width, max_dimension / img.height)
        if ratio < 1.0:
            new_size = (int(img.width * ratio), int(img.height * ratio))
            # Use LANCZOS instead of ANTIALIAS (deprecated in Pillow 10+)
            img = img.resize(new_size, Image.Resampling.LANCZOS if hasattr(Image, 'Resampling') else Image.LANCZOS)
            
        img.save(output_path, 'WEBP', quality=85)
        print(f"Saved: {output_path}")
    except Exception as e:
        print(f"Error converting {input_path}: {e}")

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    public_dir = os.path.join(base_dir, 'public')
    assets_dir = os.path.join(public_dir, 'assets')
    
    # 1. Background Image
    bg = os.path.join(public_dir, 'harfen-studio.jpeg')
    if os.path.exists(bg):
        convert_to_webp(bg, os.path.join(public_dir, 'harfen-studio.webp'), max_dimension=1920)
        
    # 2. Baked Characters
    chars = ['mazen-transparent_baked.png', 'mariya-transparent_baked.png']
    for char in chars:
        in_path = os.path.join(public_dir, char)
        out_path = os.path.join(public_dir, char.replace('.png', '.webp'))
        if os.path.exists(in_path):
            convert_to_webp(in_path, out_path)
            
    # 3. Baked Narrative Assets
    if os.path.exists(assets_dir):
        for f in os.listdir(assets_dir):
            if f.endswith('_baked.png'):
                in_path = os.path.join(assets_dir, f)
                out_path = os.path.join(assets_dir, f.replace('.png', '.webp'))
                convert_to_webp(in_path, out_path)

if __name__ == '__main__':
    main()
