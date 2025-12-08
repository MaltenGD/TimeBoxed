# 🏛️ Arquitectura de Timeboxed: 

Este documento detalla la estructura técnica, las clases principales, el flujo de escenas y la lógica de los minijuegos dentro del proyecto **Timeboxed**.

---

## 📑 Índice

1. [Clases y Controladores Generales](#-clases-y-controladores-generales)
2. [Escenas Principales](#-escenas-principales)
3. [Minijuegos](#-minijuegos)
    - [Aseb (Egipto)](#-aseb-egipto)
    - [Tali (Roma)](#-tali-roma)
    - [Hanafuda (Japón)](#-hanafuda-japón)

---

## 🛠️ Clases y Controladores Generales

Estas clases gestionan funcionalidades transversales utilizadas en múltiples escenas del juego.

### 🎮 Controladores

#### **DialogueController**
Gestiona el sistema de diálogos del juego, interpretando los archivos JSON y mostrando texto en pantalla.

<details>
<summary><strong>Ver Diagrama: DialogueController</strong></summary>

```mermaid
classDiagram
    class DialogueController {
        +DialogBox dialogBox
        +Phaser.Scene scene
        +string era
        +Object dialogueData
        +Object dialogueGroup
        +string nextID
        +Dialogue currentDialogue
        +Phaser.Sound.BaseSound dialogueTextSound
        +number dialogueTextVolume

        +constructor(scene, era, dialogueData)
        +iniDialogue()
        +startDialogueBlock(keyID)
        +handleInteraction()
        +skipToEnd()
        +endDialogueBlock()
        +fadeOutSound(duration)
        +showCurrentDialogue()
        +shutdown()
        +pause()
        +resume()
    }

    class DialogBox {
        <<External>>
    }
    class Dialogue {
        <<Entity>>
    }
    class Speaker {
        <<Entity>>
    }

    DialogueController --> DialogBox : Instancia
    DialogueController --> Dialogue : Instancia
    DialogueController --> Speaker : Instancia
```
</details>

#### **TransitionController**
Encargado de gestionar los efectos visuales al cambiar de escena (Fade In, Fade Out, etc.).

<details>
<summary><strong>Ver Diagrama: TransitionController</strong></summary>

```mermaid
classDiagram
    class TransitionController {
        +Phaser.Scene scene
        +Phaser.Cameras.Scene2D.Camera camera
        +Phaser.Events.EventEmitter emitter

        +constructor(scene)
        +startFadeOutTransition(callback, time, color)
        +startFadeInTransition(callback, time, color)
    }

    class RGBColor {
        +number red
        +number green
        +number blue
        +number alpha
        +constructor(red, green, blue, alpha)
    }

    TransitionController ..> RGBColor : Usa
```
</details>

#### **SkipButton**
Un componente de UI que actúa como *Helper* del `DialogueController`, permitiendo saltar diálogos.

<details>
<summary><strong>Ver Diagrama: SkipButton</strong></summary>

```mermaid
classDiagram
    class SkipButton {
        +DialogueController dialogueController
        +Object playerData

        +constructor(scene, x, y, dialogueController, playerData)
        +handlePointerOver()
        +handlePointerOut()
        +handlePointerDown()
    }

    class PhaserGameObjectImage {
        <<External>>
    }
    class DialogueController {
        <<Helper>>
    }

    SkipButton --|> PhaserGameObjectImage : Hereda
    SkipButton --> DialogueController : Controla
```
</details>

### ⚙️ Managers y Utilidades

#### **AchievementManager**
Sistema centralizado para gestionar, desbloquear y guardar los logros del jugador.

<details>
<summary><strong>Ver Diagrama: AchievementManager</strong></summary>

```mermaid
classDiagram
    class AchievementManager {
        +number awardedAchievements
        +Map achievementMap
        +number nrOfAchievements
        +number nrOfAwardedAchievements

        +constructor()
        +loadAchievements(jsonFile)
        +getAchievementByKey(key)
        +awardAchievement(key)
        +revokeAchievement(key)
        +checkGameCompletion(playerData)
    }

    class Achievement {
        <<Entity>>
    }

    AchievementManager *-- Achievement : Gestiona
```
</details>

#### **RandomNumber**
Clase estática utilitaria para la generación de números aleatorios dentro de un intervalo específico.

<details>
<summary><strong>Ver Diagrama: RandomNumber</strong></summary>

```mermaid
classDiagram
    class RandomNumber {
        +get(min, max)$ : number
    }
```
</details>

---

## 🎬 Escenas Principales

Estructura de las escenas base y menús de navegación del juego.

### **Base Scene**
Clase padre de la que heredan la mayoría de las escenas. Gestiona la música global, el menú de opciones y la detección de input básico.

### **Loading Scene**
Escena de carga inicial de assets.

<details>
<summary><strong>Ver Diagrama: Loading Scene</strong></summary>

```mermaid
classDiagram
    class LoadingScene {
        +number with
        +number height
        +AchievementManager achievementManager

        +constructor()
        +preload()
        +create()
        +loadMainMenuAssets()
        +loadAudioAssets()
        +loadIntroAssets()
        +loadOptionMenuAssets()
        +loadSelectionMenuAssets()
        +loadAsebAssets()
        +loadTaliAssets()
        +loadHanafudaAssets()
        +loadCreditsAssets()
        +loadInisgniaAssets()
        +loadDialogues()
        +createAchievementManager()
    }

    class PhaserScene {
        <<External>>
    }
    class AchievementManager {
        <<Helper>>
    }

    LoadingScene --|> PhaserScene : Hereda
    LoadingScene --> AchievementManager : Usa
```
</details>

### **Intro**
Cinemática o secuencia inicial del juego.

<details>
<summary><strong>Ver Diagrama: Intro</strong></summary>

```mermaid
classDiagram
    class Intro {
        +Object playerData
        +TransitionController transitionController
        +Phaser.GameObjects.Image background
        +Phaser.GameObjects.Text backBtn
        +DialogueController dialogueController
        +SkipButton skipBtn

        +constructor()
        +create(playerData)
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
    }

    class DialogueController {
        <<Helper>>
    }
    class SkipButton {
        <<Helper>>
    }
    class TransitionController {
        <<Helper>>
    }

    Intro --|> BaseScene : Hereda
    Intro --> DialogueController : Usa
    Intro --> SkipButton : Usa
    Intro --> TransitionController : Usa
```
</details>

### **Start**
Pantalla de título o "Press Start".

<details>
<summary><strong>Ver Diagrama: Start</strong></summary>

```mermaid
classDiagram
    class Start {
        +boolean firstAccess
        +Object playerData
        +TransitionController transitionController
        +Phaser.GameObjects.Image background
        +Phaser.Sound.BaseSound music
        +Array soundInstances
        +Array wanderingTweens
        +Array arrangementTweens
        +boolean arranged

        +constructor()
        +create(playerData)
        +changeTimeboxedMode(state)
        +startWandering(letters)
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
        +DisableOptionMenu()
    }

    class TransitionController {
        <<Helper>>
    }

    Start --|> BaseScene : Hereda
    Start --> TransitionController : Usa
```
</details>

### **Credits Scene**
Créditos del equipo de desarrollo.

<details>
<summary><strong>Ver Diagrama: Credits Scene</strong></summary>

```mermaid
classDiagram
    class CreditsScene {
        +Object playerData
        +TransitionController transitionController
        +Array members
        +Object activeBox
        +Array boxes

        +constructor()
        +create(playerData)
        +toggleBox(box)
        +openBox(box)
        +closeBox(box)
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
        +DisableOptionMenu()
    }

    class TransitionController {
        <<Helper>>
    }

    CreditsScene --|> BaseScene : Hereda
    CreditsScene --> TransitionController : Usa
```
</details>

### **Settings Scene**
Configuración de audio y vídeo.

<details>
<summary><strong>Ver Diagrama: Settings Scene</strong></summary>

```mermaid
classDiagram
    class SettingsScene {
        +string fromScene
        +Object playerData
        +number mainColor
        +Phaser.Sound.BaseSound testSound

        +constructor()
        +init(data)
        +create()
        +createSlider(x, y, initialValue, callback)
    }

    class PhaserScene {
        <<External>>
    }

    SettingsScene --|> PhaserScene : Hereda
```
</details>

### **Option Menu Scene**
Menú de pausa accesible desde el juego.

<details>
<summary><strong>Ver Diagrama: Option Menu Scene</strong></summary>

```mermaid
classDiagram
    class OptionMenuScene {
        +Object playerData
        +number FromSelectionMenuOffset
        +TransitionController transitionController

        +constructor()
        +preload()
        +create(playerData)
        +close()
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
    }

    class TransitionController {
        <<Helper>>
    }

    OptionMenuScene --|> BaseScene : Hereda
    OptionMenuScene --> TransitionController : Usa
```
</details>

### **Help Lobby Scene**
Zona de ayuda o tutorial general.

<details>
<summary><strong>Ver Diagrama: Help Lobby Scene</strong></summary>

```mermaid
classDiagram
    class HelpLobbyScene {
        +Object playerData
        +Phaser.GameObjects.Image background

        +constructor()
        +preload()
        +create(playerData)
        +addTutorialButton(x, y, text, sceneToLaunch)
        +exitHelpLobby()
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
        +DisableOptionMenu()
    }

    HelpLobbyScene --|> BaseScene : Hereda
```
</details>

### **Items Scene**
Galería de logros. Permite inspeccionar detalles de cada logro desbloqueado.

![ItemsScene](images/Arquitectura/ItemsScene.png)

### **Confirm Menu Scene**
Pop-up genérico para confirmaciones (Sí/No).

<details>
<summary><strong>Ver Diagrama: Confirm Menu Scene</strong></summary>

```mermaid
classDiagram
    class ConfirmMenuScene {
        +Object playerData
        +TransitionController transitionController
        +Phaser.GameObjects.Rectangle overlay
        +Phaser.GameObjects.Rectangle box
        +Phaser.GameObjects.Text titleText
        +Phaser.GameObjects.Text yesBtn
        +Phaser.GameObjects.Text noBtn
        +string sceneToPause

        +constructor()
        +create(data)
        +closeMenu()
        +setPausedScene(sceneName)
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
        +DisableOptionMenu()
    }

    class TransitionController {
        <<Helper>>
    }

    ConfirmMenuScene --|> BaseScene : Hereda
    ConfirmMenuScene --> TransitionController : Usa
```
</details>

### **Selection Menu Scene**
Hub central para seleccionar qué minijuego jugar.

<details>
<summary><strong>Ver Diagrama: Selection Menu Scene</strong></summary>

```mermaid
classDiagram
    class SelectionMenuScene {
        +Object playerData
        +TransitionController transitionController
        +Phaser.GameObjects.Image background
        +Array buttons
        +boolean deployed
        +number buttonGap
        +Object[] initialPositions
        +Object[] finalPositions
        +Object[] backgroundCrops
        +string[] opciones
        +string[] scenes
        +Object completionFlags

        +constructor()
        +create(playerData)
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
    }

    class TransitionController {
        <<Helper>>
    }

    SelectionMenuScene --|> BaseScene : Hereda
    SelectionMenuScene --> TransitionController : Usa
```
</details>

### **Game Mode Selection Scene**
Selección de dificultad o modo de juego (Normal vs Timeboxed).

<details>
<summary><strong>Ver Diagrama: Game Mode Selection Scene</strong></summary>

```mermaid
classDiagram
    class GameModeSelectionScene {
        +Object playerData
        +TransitionController transitionController
        +Phaser.GameObjects.Rectangle overlay
        +Phaser.GameObjects.Rectangle box
        +Phaser.GameObjects.Text titleText
        +Phaser.GameObjects.Text descText
        +Phaser.GameObjects.Text NormalBtn
        +Phaser.GameObjects.Text TimeboxedBtn
        +string sceneToPause

        +constructor()
        +create(data)
        +setPausedScene(sceneName)
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
        +DisableOptionMenu()
    }

    class TransitionController {
        <<Helper>>
    }

    GameModeSelectionScene --|> BaseScene : Hereda
    GameModeSelectionScene --> TransitionController : Usa
```
</details>

### **Game Completed**
Pantalla final tras completar el juego.

<details>
<summary><strong>Ver Diagrama: Game Completed</strong></summary>

```mermaid
classDiagram
    class GameCompleted {
        +Object playerData
        +TransitionController transitionController
        +Phaser.GameObjects.Image background
        +Phaser.GameObjects.Text backBtn
        +DialogueController dialogueController
        +SkipButton skipBtn

        +constructor()
        +create(playerData)
        +resetPlayerData()
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
    }

    class DialogueController {
        <<Helper>>
    }
    class SkipButton {
        <<Helper>>
    }
    class TransitionController {
        <<Helper>>
    }

    GameCompleted --|> BaseScene : Hereda
    GameCompleted --> DialogueController : Usa
    GameCompleted --> SkipButton : Usa
    GameCompleted --> TransitionController : Usa
```
</details>

### **TimeboxedDefeat**
Pantalla de "Game Over" específica para el modo contrarreloj.

<details>
<summary><strong>Ver Diagrama: TimeboxedDefeat</strong></summary>

```mermaid
classDiagram
    class TimeBoxedDefeat {
        +Object playerData
        +TransitionController transitionController
        +Phaser.GameObjects.Image background
        +DialogueController dialogueController

        +constructor()
        +preload()
        +create(playerData)
        +resetPlayerData()
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
        +DisableOptionMenu()
    }

    class DialogueController {
        <<Helper>>
    }
    class TransitionController {
        <<Helper>>
    }

    TimeBoxedDefeat --|> BaseScene : Hereda
    TimeBoxedDefeat --> DialogueController : Usa
    TimeBoxedDefeat --> TransitionController : Usa
```
</details>

## 🔄 Flujo General del Juego

Diagrama de flujo global que conecta todas las escenas principales, minijuegos y condiciones de victoria/derrota.

<details>
<summary><strong>Ver Flowchart General</strong></summary>

```mermaid
flowchart TD
    %% Nodos Principales
    Start([Pantalla Título / Start])
    Credits([Créditos])
    ModeSel[Selección de Modo / Dificultad]
    Intro[Intro Narrativa]
    SelMenu{Hub Central: Selección de Nivel}
    
    %% Nodos de Minijuegos (Simplificados)
    Aseb[Minijuego: Aseb - Egipto]
    Tali[Minijuego: Tali - Roma]
    Hanafuda[Minijuego: Hanafuda - Japón]
    
    %% Nodos Finales
    GameComp[Final del Juego]
    TBDefeat[Derrota Timeboxed]

    %% Flujo Inicial
    Start -->|Click Créditos| Credits
    Credits -->|Volver| Start
    Start -->|Click Jugar| ModeSel
    
    ModeSel -->|Primera vez| Intro
    ModeSel -->|Intro ya vista| SelMenu
    Intro -->|Terminar Intro| SelMenu

    %% Hub Central
    SelMenu -->|Elegir Egipto| Aseb
    SelMenu -->|Elegir Roma| Tali
    SelMenu -->|Elegir Japón| Hanafuda

    %% Lógica de Victoria (Retorno al Hub)
    Aseb -->|Victoria| SelMenu
    Tali -->|Victoria| SelMenu
    Hanafuda -->|Victoria| SelMenu

    %% Lógica de Derrota (Modo Normal)
    Aseb -->|Derrota Normal| SelMenu
    Tali -->|Derrota Normal| SelMenu
    Hanafuda -->|Derrota Normal| SelMenu

    %% Lógica de Derrota (Modo Timeboxed - Muerte Súbita)
    Aseb -.->|Derrota Timeboxed| TBDefeat
    Tali -.->|Derrota Timeboxed| TBDefeat
    Hanafuda -.->|Derrota Timeboxed| TBDefeat
    TBDefeat -->|Game Over / Reinicio| Start

    %% Final del Juego
    SelMenu -- Verificación Automática --> Check{¿Todo Completado?}
    Check -->|Sí| GameComp
    Check -->|No| SelMenu
    GameComp -->|Ver Créditos| Credits
```
</details>

---

## 🎮 Minijuegos

### 🏺 Aseb (Egipto)

El juego de mesa "Aseb" contra Anubis.

#### 📋 Listado de Escenas

*   **`IntroAsebScene`**: Introducción narrativa. Encuentro con Anubis. (Diálogos + SkipButton).
*   **`TutorialAsebScene`**: Explicación de las reglas. (Diálogos + SkipButton).
*   **`AsebBeginScene`**: Minijuego de "tirar los palos" para decidir quién empieza.
*   **`AsebScene`**: La escena principal del juego de tablero (Gameplay).
*   **`AsebVictoryScene`**: Narrativa tras ganar la partida.
*   **`AsebDefeatScene`**: Narrativa tras perder la partida.

#### 🔀 Flujo de Escenas (Flowchart)

<details>
<summary><strong>Ver Flowchart de Aseb</strong></summary>

```mermaid
flowchart TD
    A[/IntroAseb/] -->|Dialogo Termina| C{Confirm Menu}
    C -->|Click en YES| D[/TutorialAseb/]
    D -->|Dialogo Termina| F[AsebBegin]
    C -->|Click en NO| F
    F -->|Se decide el primer jugador| G(AsebScene)
    G -->|El jugador gana| H[/AsebVictoryScene/]
    G -->|El jugador pierde| I[/AsebDefeatScene/]
    I -->|Modo Timeboxed| J(Start)
    I -->|Modo Normal| F
    H --> SelectionMenu
```
</details>

#### 📐 Diagramas de Arquitectura (Escenas)

<details>
<summary><strong>Ver Diagrama: IntroAseb</strong></summary>

```mermaid
classDiagram
    class IntroAseb {
        %% Properties defined in create
        +Object playerData
        +TransitionController transitionController
        +Phaser.Sound.BaseSound music
        +Array soundInstances
        +Phaser.GameObjects.Image background
        +Phaser.GameObjects.Text backBtn
        +DialogueController dialogueController
        +SkipButton skipBtn
        
        %% Methods
        +constructor()
        +create(playerData)
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
    }

    class DialogueController {
        <<Helper>>
    }
    class SkipButton {
        <<Helper>>
    }

    class TransitionController {
         <<Helper>>
    }

    IntroAseb --|> BaseScene : Hereda
    IntroAseb --> DialogueController : Usa
    IntroAseb --> SkipButton : Usa
    IntroAseb --> TransitionController : Usa
```
</details>

<details>
<summary><strong>Ver Diagrama: TutorialAseb</strong></summary>

```mermaid
classDiagram
    class TutorialAseb {
        %% Properties defined in create
        +Object playerData
        +number width
        +number height
        +Phaser.GameObjects.Image background
        +TransitionController transitionController
        +DialogueController dialogueController
        +Phaser.GameObjects.Image tutoImage

        %% Methods
        +constructor()
        +create(playerData)
        +changeTutoImage(imageKey)
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
        +DisableOptionMenu()
    }

    class DialogueController {
        <<Helper>>
    }

    class TransitionController {
        <<Helper>>
    }

    TutorialAseb --|> BaseScene : Hereda
    TutorialAseb --> DialogueController : Usa
    TutorialAseb --> TransitionController : Usa

```
</details>

<details>
<summary><strong>Ver Diagrama: AsebBeginScene</strong></summary>

```mermaid
classDiagram
    class AsebBeginScene {
        %% Properties defined in constructor
        +Object GAME_STATE
        +boolean debugMode
        +string state

        %% Properties defined in create
        +number width
        +number height
        +Object playerData
        +Phaser.Sound.BaseSound music
        +Array soundInstances
        +TransitionController transitionController
        +Phaser.GameObjects.Image background
        +AsebGame asebGame
        
        %% UI Objects
        +Phaser.GameObjects.Image infoBoard
        +Phaser.GameObjects.Text infoText
        +Phaser.GameObjects.Text scoreText
        +Phaser.GameObjects.Container backBtn
        +Phaser.GameObjects.Image throwBtnImage
        +Phaser.GameObjects.Text throwBtnText
        +Phaser.GameObjects.Container throwBtn
        +Phaser.GameObjects.Image[] stickImages

        %% Logic variables
        +Object playerStickResult
        +Object enemyStickResult

        %% Methods
        +constructor()
        +createGameObjects()
        +createButtons()
        +continue(newState)
        +create(playerData)
        +playerInitialThrow()
        +enemyInitialThrow()
        +announceBeginner()
        +showSticks(throws)
        +clearSticks(onCompleteCallback)
        +setObjectState(object, state)
        +animateButtonState(button, show, duration)
        +setTextWithAnimation(textObject, newText, AnimDuration)
        +shutdownMusic()
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
    }

    class AsebGame {
        <<Logic>>
        +getThrow()
    }

    class TransitionController {
         <<Helper>>
    }

    AsebBeginScene --|> BaseScene : Hereda
    AsebBeginScene --> AsebGame : Instancia
    AsebBeginScene --> TransitionController : Usa

```
</details>

<details>
<summary><strong>Ver Diagrama: AsebScene (Gameplay Principal)</strong></summary>

```mermaid
classDiagram
    class AsebScene {
        %% Properties defined in constructor
        +boolean debugMode
        
        %% Properties defined in preload/create
        +number width
        +number height
        +Object boardAnchor
        +Object playerData
        +boolean playerFirst
        +Phaser.Sound.BaseSound music
        +Array soundInstances
        +boolean anyPieceCaptured
        +TransitionController transitionController
        +Phaser.GameObjects.Image background
        +Phaser.GameObjects.Image infoBoard
        +Phaser.GameObjects.Container backBtn
        +Phaser.GameObjects.Text winBtn
        +Phaser.GameObjects.Text loseBtn
        +AsebGame asebGame
        +AsebBoard board
        +number pauseTime
        +Phaser.GameObjects.Text infoText
        +Phaser.GameObjects.Text eventsText
        +Phaser.GameObjects.Image throwBtnImage
        +Phaser.GameObjects.Text throwBtnText
        +Phaser.GameObjects.Container throwBtn

        %% Methods
        +constructor()
        +preload()
        +create(playerData)
        +nextTurn()
        +startPlayerTurn()
        +playerThrows()
        +startEnemyTurn()
        +pieceReachesEnd(piece)
        +setTextWithAnimation(textObject, newText, AnimDuration)
        +setObjectState(object, state)
        +animateButtonState(button, show, duration)
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
        +awardAch(achievementID)
        +fadeOutAndKillSounds(duration)
        +pauseSounds()
        +resumeSounds()
        +setInteractiveCursor()
        +DisableOptionMenu()
        +EnableOptionMenu()
    }

    class AsebGame {
        <<Logic>>
    }

    class AsebBoard {
        <<Entity>>
    }

    class TransitionController {
         <<Helper>>
    }

    AsebScene --|> BaseScene : Hereda
    AsebScene --> AsebGame : Instancia
    AsebScene --> AsebBoard : Instancia
    AsebScene --> TransitionController : Usa

```
</details>

<details>
<summary><strong>Ver Diagrama: AsebVictoryScene</strong></summary>

```mermaid
classDiagram
    class AsebVictoryScene {
        %% Properties defined in create
        +Object playerData
        +TransitionController transitionController
        +Phaser.Sound.BaseSound music
        +Array soundInstances
        +Phaser.GameObjects.Image background
        +Phaser.GameObjects.Text backBtn
        +DialogueController dialogueController
        +SkipButton skipBtn

        %% Methods
        +constructor()
        +create(playerData)
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
        +awardAch(achievementID)
    }

    class DialogueController {
        <<Helper>>
    }
    class SkipButton {
        <<Helper>>
    }

    class TransitionController {
         <<Helper>>
    }

    AsebVictoryScene --|> BaseScene : Hereda
    AsebVictoryScene --> DialogueController : Usa
    AsebVictoryScene --> SkipButton : Usa
    AsebVictoryScene --> TransitionController : Usa


```
</details>

<details>
<summary><strong>Ver Diagrama: AsebDefeatScene</strong></summary>

```mermaid
classDiagram
    class AsebDefeatScene {
        %% Properties defined in create
        +Object playerData
        +TransitionController transitionController
        +Phaser.Sound.BaseSound music
        +Array soundInstances
        +Phaser.GameObjects.Image background
        +DialogueController dialogueController
        +SkipButton skipBtn

        %% Methods
        +constructor()
        +create(playerData)
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
        +DisableOptionMenu()
    }

    class DialogueController {
        <<Helper>>
    }
    class SkipButton {
        <<Helper>>
    }

    class TransitionController {
         <<Helper>>
    }

    AsebDefeatScene --|> BaseScene : Hereda
    AsebDefeatScene --> DialogueController : Usa
    AsebDefeatScene --> SkipButton : Usa
    AsebDefeatScene --> TransitionController : Usa
```
</details>

#### 🧩 Clases de Lógica y Entidades (Aseb)

Clases que manejan la lógica interna y los elementos del tablero de Aseb.

**AsebGame (Controlador Lógico)**
Encargado de los turnos, estado de la partida y condiciones de victoria.

```mermaid
classDiagram
    class AsebGame {
        +Phaser.Scene scene
        +boolean playerFirst
        +GAME_STATE state
        +AsebPlayer player
        +AsebMachine enemy
        
        +constructor(scene, playerFirst)
        +getThrow() : Object
        +checkForWinner()
        +pieceReachedEnd(piece)
    }

    class AsebPlayer {
        <<Entity>>
    }
    class AsebMachine {
        <<Entity>>
    }

    AsebGame *-- AsebPlayer : Posee
    AsebGame *-- AsebMachine : Posee
```

**AsebBoard (Tablero)**
Maneja la cuadrícula, las posiciones válidas y la colección de fichas.

```mermaid
classDiagram
    class AsebBoard {
        +Phaser.Scene scene
        +AsebGame asebGame
        +number rows
        +number cols
        +AsebBoardPos[][] positions
        +Object[] specialBoxes
        +AsebPiece[] enemyPieces
        +AsebPiece[] playerPieces

        +constructor(scene, x, y, image)
        +createPositions()
        +createPieces()
        +setPlayerPieceInteractable(state)
        +getNextBoardPosition(piece, numPositions) : Object
        +IsThereValidMoves(piecesArray, moves) : boolean
        +IsValidMove(piece, position) : Object
        +TryMovePiece(piece, position) : boolean
        +checkNewPosition(isSpecialPosition, piece, row, col)
        +doRandomMovement(StickResultSum)
        +checkLandedAllSpecialPositions() : boolean
    }

    class AsebBoardPos {
        <<Entity>>
    }
    class AsebPiece {
        <<Entity>>
    }
    class PhaserGameObjectImage {
        <<External>>
    }

    AsebBoard --|> PhaserGameObjectImage : Hereda
    AsebBoard *-- AsebBoardPos : Maneja
    AsebBoard *-- AsebPiece : Maneja
```

**AsebBoardPos (Casilla)**
Representa una celda individual en el tablero.

```mermaid
classDiagram
    class AsebBoardPos {
        +AsebBoard board
        +number x
        +number y
        +boolean isSpecial
        +AsebPiece piecePlaced
        +boolean validPos
        +boolean playerlandedHere
        
        +constructor(board, x, y, piecePlaced, validPos)
        +SetPiece(piece)
    }

    class AsebBoard {
        <<Entity>>
    }
    class AsebPiece {
        <<Entity>>
    }

    AsebBoardPos --> AsebBoard : Pertenece a
    AsebBoardPos o-- AsebPiece : Contiene
```

**AsebPiece (Ficha)**
Representa la ficha del jugador o del enemigo. Hereda de `Phaser.GameObjects.Image`.

```mermaid
classDiagram
    class AsebPiece {
        +PIECE_TYPE type
        +Object SpawnPoint
        +AsebBoard board
        +Object boardPos
        +boolean movable
        +Phaser.Tweens.Tween idleTween

        +constructor(scene, x, y, image, board, type)
        +setIdleAnimation(animate)
        +onClick()
        +setBoardVariables(row, col)
        +MoveInScreen(x, y, IsSpecialPosition, row, col, AnimDuration)
        +setInteractable(state, moves)
        +ReturnToSpawn()
        +Ended() : boolean
    }

    class AsebBoard {
        <<Entity>>
    }
    class PhaserGameObjectImage {
        <<External>>
    }

    AsebPiece --|> PhaserGameObjectImage : Hereda
    AsebPiece --> AsebBoard : Referencia
```

**AsebPlayer & AsebMachine (Entidades)**
Clases de datos simples para almacenar el estado de puntuación.

```mermaid
classDiagram
    class AsebPlayer {
        +number actualStickResult
        +number winningPieces
        
        +constructor()
    }
```

```mermaid
classDiagram
    class AsebMachine {
        +number actualStickResult
        +number winningPieces
        
        +constructor()
    }
```

---

### 🎲 Tali (Roma)

Todas las escenas del juego Tali.

#### Listado de Escenas
*   **TaliIntroScene**: La escena de introducción. Contiene solo los diálogos.
*   **TaliTutorialScene**: La escena que contiene el tutorial para Tali.
*   **TaliBeginScene**: La escena donde se determina el jugador que empieza.
*   **TaliScene**: La escena del propio juego.
*   **DistractMercuryScene**: La escena donde el jugador intenta distraer a Mercury.
*   **CombinationMenu**: La escena donde se muestran las posibles combinaciones. Aparece encima de la escena del juego.
*   **TaliEndScene**: La escena final del juego.

![TaliFlowchart](images/Arquitectura/TaliFlowChart.png)

<details>
<summary><strong>Ver Flowchart de Tali</strong></summary>

![TaliFlowchart](images/Arquitectura/TaliFlowChart.png)
</details>

#### 📐 Diagramas de Arquitectura (Escenas)

<details>
<summary><strong>Ver Diagrama: TaliIntroScene</strong></summary>

```mermaid
classDiagram
    class TaliIntroScene {
        +Object playerData
        +TransitionController transitionController
        +Phaser.GameObjects.Image background
        +Phaser.GameObjects.Text backBtn
        +DialogueController dialogueController
        +SkipButton skipBtn

        +constructor()
        +create(playerData)
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
    }

    class DialogueController {
        <<Helper>>
    }
    class TransitionController {
        <<Helper>>
    }
    class SkipButton {
        <<Helper>>
    }

    TaliIntroScene --|> BaseScene : Hereda
    TaliIntroScene --> DialogueController : Usa
    TaliIntroScene --> TransitionController : Usa
    TaliIntroScene --> SkipButton : Usa
```
</details>

<details>
<summary><strong>Ver Diagrama: TaliTutorialScene</strong></summary>

```mermaid
classDiagram
    class TaliTutorial {
        +Object playerData
        +number width
        +number height
        +Phaser.GameObjects.Image background
        +TransitionController transitionController
        +DialogueController dialogueController
        +Phaser.GameObjects.Image tutoImage

        +constructor()
        +create(playerData)
        +changeTutoImage(imageKey)
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
    }

    class DialogueController {
        <<Helper>>
    }
    class TransitionController {
        <<Helper>>
    }

    TaliTutorial --|> BaseScene : Hereda
    TaliTutorial --> DialogueController : Usa
    TaliTutorial --> TransitionController : Usa
```
</details>

<details>
<summary><strong>Ver Diagrama: TaliBeginScene</strong></summary>

```mermaid
classDiagram
    class TaliBeginScene {
        +Object GAME_STATE
        +Phaser.GameObjects.Text turnText
        +Phaser.GameObjects.Text resultText
        +Phaser.GameObjects.Image boardImg
        +Array diceImages
        +Array currentRoll
        +Phaser.GameObjects.Text playerScore
        +Phaser.GameObjects.Text enemyScore
        +boolean playerFirst
        +Object playerData
        +Tali taliGame
        +TransitionController transitionController
        +Phaser.GameObjects.Image background
        +Phaser.GameObjects.Container rollBtn
        +Phaser.GameObjects.Text backBtn
        +Phaser.GameObjects.Rectangle shine

        +constructor()
        +create(playerData)
        +createButtons()
        +makeButtonShine(btnImg)
        +addImages()
        +addText()
        +setTextWithAnimation(textObject, newText, AnimDuration)
        +playerRolls()
        +enemyRolls()
        +continue(state)
        +calculateBeginner()
        +tie()
        +endGame()
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
    }

    class Tali {
        <<Logic>>
    }
    class TransitionController {
        <<Helper>>
    }

    TaliBeginScene --|> BaseScene : Hereda
    TaliBeginScene --> Tali : Instancia
    TaliBeginScene --> TransitionController : Usa
```
</details>

<details>
<summary><strong>Ver Diagrama: TaliScene (Gameplay Principal)</strong></summary>

```mermaid
classDiagram
    class TaliScene {
        +Object playerData
        +number width
        +number height
        +Phaser.Sound.BaseSound music
        +TransitionController transitionController
        +Tali taliGame
        +boolean playerFirst
        +Phaser.GameObjects.Image background
        +Phaser.GameObjects.Image boardImg
        +Phaser.GameObjects.Container rollBtn
        +Phaser.GameObjects.Text backBtn
        +Phaser.GameObjects.Text combinationMenuBtn
        +Phaser.GameObjects.Text enemyScoreText
        +Phaser.GameObjects.Text playerScoreText
        +Phaser.GameObjects.Text turnText
        +Phaser.GameObjects.Text resultText

        +constructor()
        +create(playerData)
        +createUI()
        +addImages()
        +createButtons()
        +createButton(x, y, label, onClick, style, pointeroverStyle)
        +makeButtonShine(btnImg, btnContainer)
        +resetButton(btn, label, onClick)
        +openCombinationMenu()
        +setObjectState(object, state)
        +addText()
        +setTextWithAnimation(textObject, newText, AnimDuration)
        +startGame()
        +registerEvents()
        +onStateChange(state)
        +endGame()
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
    }

    class Tali {
        <<Logic>>
    }
    class TransitionController {
        <<Helper>>
    }

    TaliScene --|> BaseScene : Hereda
    TaliScene --> Tali : Instancia
    TaliScene --> TransitionController : Usa
```
</details>

<details>
<summary><strong>Ver Diagrama: DistractMercuryScene</strong></summary>

```mermaid
classDiagram
    class DistractMercuryScene {
        +Object playerData
        +Array mercuryRoll
        +number width
        +number height
        +Array diceImages
        +Array disabledDiceImages
        +Array dice
        +TransitionController transitionController
        +Array possibleDialogues
        +Array optionText
        +number dialogueIndex
        +Phaser.GameObjects.Rectangle background
        +Phaser.GameObjects.Text infoText
        +DialogueController dialogueController
        +Phaser.GameObjects.Container optionOne
        +Phaser.GameObjects.Container optionTwo

        +constructor()
        +create(data)
        +addImages()
        +addText()
        +createAndBeginDialogue()
        +addButtons()
        +createButton(x, y, label, onClick, style, pointeroverStyle)
        +hideOptions()
        +showOptions()
        +checkOption(option)
        +showMercuryDice()
        +onDiceClicked(diceIndex)
        +showDiceOptions(diceIndex)
        +changeDice(diceToChange, changeToIndex)
        +returnToGame()
        +addListeners()
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
    }

    class DialogueController {
        <<Helper>>
    }
    class TransitionController {
        <<Helper>>
    }

    DistractMercuryScene --|> BaseScene : Hereda
    DistractMercuryScene --> DialogueController : Usa
    DistractMercuryScene --> TransitionController : Usa
```
</details>

<details>
<summary><strong>Ver Diagrama: CombinationMenu</strong></summary>

```mermaid
classDiagram
    class CombinationMenu {
        +Object playerData
        +boolean closing
        +number width
        +number height
        +Phaser.GameObjects.Rectangle overlay
        +Phaser.GameObjects.Container imageContainer
        +Phaser.GameObjects.Image combinationsImage
        +Phaser.GameObjects.Text closeBtn

        +constructor()
        +init(data)
        +create()
        +createMenu()
        +animateMenuIn()
        +closeMenu()
    }

    class PhaserScene {
        <<External>>
    }

    CombinationMenu --|> PhaserScene : Hereda
```
</details>

<details>
<summary><strong>Ver Diagrama: TaliEndScene</strong></summary>

```mermaid
classDiagram
    class TaliEndScene {
        +DialogueController dialogueController
        +Object playerData
        +boolean playerWon
        +AchievementManager achManager
        +TransitionController transitionController
        +Phaser.GameObjects.Image background
        +Phaser.GameObjects.Image boardImg
        +Phaser.GameObjects.Text backBtn
        +Phaser.GameObjects.Text victoryText
        +SkipButton skipBtn

        +constructor()
        +create(playerData)
        +createUI()
        +setDialogue()
        +addImages()
        +createButtons()
        +createButton(x, y, label, onClick, style, pointeroverStyle)
        +addText()
    }

    class BaseScene {
        +soundInstances
        +OptionMenuCanBeOpened
        +init()
        +shutdown()
        +openOptionMenu()
        +KillSounds()
    }

    class DialogueController {
        <<Helper>>
    }
    class TransitionController {
        <<Helper>>
    }
    class SkipButton {
        <<Helper>>
    }

    TaliEndScene --|> BaseScene : Hereda
    TaliEndScene --> DialogueController : Usa
    TaliEndScene --> TransitionController : Usa
    TaliEndScene --> SkipButton : Usa
```
</details>

#### 🧩 Clases de Lógica y Entidades (Tali)

**Tali (Controlador Lógico)**
Gestiona el estado del juego, los turnos y las tiradas de dados.

```mermaid
classDiagram
    class Tali {
        +Phaser.Scene scene
        +number width
        +number height
        +Phaser.Events.EventEmitter emitter
        +number turnCount
        +boolean playerFirst
        +TaliPlayer player
        +TaliPlayer enemy
        +string state
        +Array diceThrows
        +Array diceImages
        +Array throwImages
        +Array currentRoll
        +Array diceNrs
        +number diceRollIndex
        +number diceThrowIndex
        +Array counter
        +boolean lunaThrow
        +Phaser.GameObjects.Text noComboText

        +constructor(scene, canvasWidth, canvasHeight, playerFirst)
        +startGame()
        +nextTurn()
        +emitState()
        +generalRoll(player)
        +rollDice()
        +identifyRoll(taliPlayer)
        +checkAddAllRolls()
        +setDiceImages()
        +animateDice()
        +hideDice()
        +animateThrows()
        +hideThrows()
        +playerWon()
    }

    class TaliPlayer {
        <<Entity>>
    }

    Tali *-- TaliPlayer : Maneja
```

**TaliPlayer (Entidad)**
Representa a un jugador (usuario o IA), gestionando su puntuación y tiradas.

```mermaid
classDiagram
    class TaliPlayer {
        +Score score
        +Array throws
        
        +constructor()
        +resetScore()
        +addThrows(roll)
    }

    class Score {
        +number score
        +addScore(score)
    }

    TaliPlayer *-- Score : Posee
```

---

### 🎴 Hanafuda (Japón)


---
