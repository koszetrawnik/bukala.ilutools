# bukala.ilutools

Rozszerzenie (plugin) do Adobe Illustratora, które otwiera się jako boczny panel bezpośrednio w programie. Umożliwia korzystanie z dodatkowych narzędzi bez wychodzenia z Illustratora.

---

## Jak to działa

Po zbudowaniu projektu powstaje folder `dist/cep/`. Adobe Illustrator szuka rozszerzeń w specjalnym folderze na Twoim komputerze. Polecenie `yarn symlink` tworzy skrót (symlink), który łączy te dwa miejsca:

```
Twój kod → yarn build → dist/cep/ ←(symlink)← Adobe szuka tutaj: ~/Library/.../CEP/extensions/
```

Dzięki temu Illustrator "widzi" rozszerzenie bez kopiowania plików.

---

## Wymagania

Przed instalacją upewnij się, że masz zainstalowane:

- **Node.js** — [nodejs.org](https://nodejs.org) (pobierz wersję LTS)
- **Yarn** — po zainstalowaniu Node.js, w terminalu wpisz: `npm install -g yarn`
- **Adobe Illustrator**

---

## Jednorazowa konfiguracja — tryb deweloperski

Adobe domyślnie blokuje rozszerzenia bez oficjalnego podpisu. Musisz jednorazowo odblokować tryb deweloperski:

**macOS** (wpisz w Terminalu):
```bash
defaults write com.adobe.CSXS.11 PlayerDebugMode 1
```

**Windows** (Edytor rejestru):
```
HKEY_CURRENT_USER > Software > Adobe > CSXS.11
Dodaj nową wartość DWORD o nazwie: PlayerDebugMode
Ustaw jej wartość na: 1
```

Po wykonaniu tej czynności **zrestartuj Adobe Illustratora**.

---

## Instalacja — krok po kroku

Otwórz terminal w folderze projektu i wykonaj kolejno:

```bash
# 1. Zainstaluj zależności
yarn install

# 2. Zbuduj rozszerzenie
yarn build

# 3. Utwórz symlink do folderu Illustratora
yarn symlink
```

Polecenie `yarn symlink` tworzy skrót w folderze rozszerzeń Adobe, który wskazuje na `dist/cep/`. Nie musisz nic kopiować ręcznie.

---

## Gdzie Adobe szuka rozszerzeń

Jeśli chcesz sprawdzić, czy symlink powstał poprawnie, zajrzyj do odpowiedniego folderu:

**macOS:**
```
~/Library/Application Support/Adobe/CEP/extensions/
```

**Windows:**
```
C:\Users\TWOJA_NAZWA\AppData\Roaming\Adobe\CEP\extensions\
```

Po wykonaniu `yarn symlink` powinien pojawić się tam folder `com.bukala.ilutools`.

---

## Uruchamianie w Illustratorze

1. Otwórz **Adobe Illustrator**
2. W górnym menu wybierz: **Okno → Rozszerzenia → bukala.ilutools**
3. Panel pojawi się po prawej stronie okna programu

---

## Development (dla programistów)

Aby pracować z automatycznym odświeżaniem po każdej zmianie kodu:

```bash
yarn build   # najpierw zbuduj raz
yarn dev     # uruchom Vite dev server z HMR na localhost:3000
```

Panel odświeża się automatycznie po zapisaniu zmian.

Debugowanie panelu CEP: Chrome DevTools pod adresem `localhost:8860`

---

## Pakowanie do dystrybucji

```bash
yarn zxp   # tworzy plik .zxp w dist/zxp/ (instalacja przez Adobe Exchange)
yarn zip   # tworzy archiwum ZIP
```
