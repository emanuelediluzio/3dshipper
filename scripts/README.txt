# Istruzioni per Generazione Locale

Questo script serve per generare modelli 3D usando Hunyuan3D direttamente sul tuo computer.

## Requisiti

1. **Python 3.10+** installato.
2. **Git** installato.
3. **GPU NVIDIA** (Consigliata per Windows).
   - Su **Mac**, la generazione potrebbe fallire o essere molto lenta se le librerie CUDA non sono sostituite da MPS (non garantito out-of-the-box).

## Come usare

1. Apri il terminale (o CMD/PowerShell su Windows).
2. Naviga nella cartella `scripts`:
   ```bash
   cd scripts
   ```
3. Esegui lo script:
   ```bash
   python generate_model.py
   ```
   (Su Windows potrebbe essere `python` o `py`, su Mac `python3`)

4. Lo script:
   - Clonerà la repository di `Hunyuan3D-1`.
   - Installerà le dipendenze necessarie.
   - Ti chiederà il percorso dell'immagine da convertire (puoi trascinare il file nel terminale).

## Nota sui Pesi (Modelli AI)

La prima volta, il modello deve scaricare i "pesi" (i file del cervello dell'AI), che sono grandi svariati GB.
Per scaricarli manualmente:
```bash
pip install huggingface_hub
huggingface-cli download tencent/Hunyuan3D-1 --local-dir Hunyuan3D-1/weights
```
