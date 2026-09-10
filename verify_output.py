import json, os
from collections import Counter

data_dir = r'C:\Users\Daniel Coello\Documents\GitHub\DIGOTEC\data'

# Check files
files = os.listdir(data_dir)
print('Archivos generados en /data:')
for f in files:
    size = os.path.getsize(os.path.join(data_dir, f))
    print(f'  {f}  ({size:,} bytes / {size/1024:.0f} KB)')

print()

# Load summary
with open(os.path.join(data_dir, 'clients_summary.json'), encoding='utf-8') as f:
    data = json.load(f)

print(f'clients_summary.json: {len(data)} clientes')

lovers = Counter(c['lover_type'] for c in data)
print()
print('Distribucion de Lovers:')
for k, v in sorted(lovers.items(), key=lambda x: -x[1]):
    print(f'  {k}: {v} ({v/len(data)*100:.1f}%)')

segmentos = Counter(c['segmento_cliente'] for c in data)
print()
print('Segmentos limpios:')
for k, v in sorted(segmentos.items(), key=lambda x: -x[1]):
    print(f'  {k}: {v}')

# Alertas
with open(os.path.join(data_dir, 'alertas_vencimiento.json'), encoding='utf-8') as f:
    alertas = json.load(f)
print()
print(f'Alertas de vencimiento <90 dias: {len(alertas)} registros')
