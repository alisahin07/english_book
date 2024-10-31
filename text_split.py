import os
import re
import tkinter as tk
from tkinter import scrolledtext

# Masaüstünde "textler" klasörünü oluştur
desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
textler_folder = os.path.join(desktop_path, "textler")
os.makedirs(textler_folder, exist_ok=True)


# Tkinter arayüzü
def split_and_save_text():
    # Text alanındaki metni al
    text_content = text_area.get("1.0", tk.END)

    # Zaman damgalarına göre metni ayır (HH:MM:SS veya MM:SS formatlarını kapsar)
    segments = re.split(r'(\d{1,2}:\d{2}(?::\d{2})?)', text_content)

    # 10 dakikalık dilimleri toplamak için değişkenler
    current_segment = ""
    current_start_time = 0
    file_number = 1

    for i in range(1, len(segments), 2):
        timestamp = segments[i].strip()
        content = segments[i + 1].strip()

        # Zaman damgasını saniyeye çevir
        time_parts = list(map(int, timestamp.split(":")))
        if len(time_parts) == 3:  # HH:MM:SS formatı
            hours, minutes, seconds = time_parts
        elif len(time_parts) == 2:  # MM:SS formatı
            hours = 0
            minutes, seconds = time_parts
        else:
            continue

        time_in_seconds = hours * 3600 + minutes * 60 + seconds

        # Yeni bir 10 dakikalık segment başladığında dosyayı kaydet ve sıfırla
        if time_in_seconds >= current_start_time + 600:
            if current_segment:
                filename = f"text{file_number}.txt"
                with open(os.path.join(textler_folder, filename), 'w', encoding='utf-8') as f:
                    f.write(current_segment)
                file_number += 1
                current_segment = ""
                current_start_time += 600

        # İçeriği mevcut segmente ekle
        current_segment += f"{timestamp}\n{content}\n"

    # Son segmenti kaydet
    if current_segment:
        filename = f"text{file_number}.txt"
        with open(os.path.join(textler_folder, filename), 'w', encoding='utf-8') as f:
            f.write(current_segment)

    # Bilgilendirme mesajı
    result_label.config(text="Metin başarıyla ayrıldı ve kaydedildi!")


# Tkinter penceresi
window = tk.Tk()
window.title("Metin Ayırıcı")

# Text alanı
text_area = scrolledtext.ScrolledText(window, width=60, height=20)
text_area.pack(pady=10)

# İşlem başlatma butonu
split_button = tk.Button(window, text="Metni Ayır ve Kaydet", command=split_and_save_text)
split_button.pack(pady=5)

# Sonuç mesajı
result_label = tk.Label(window, text="")
result_label.pack(pady=5)

window.mainloop()
