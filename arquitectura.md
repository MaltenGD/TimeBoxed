# Arquitectura de Timeboxed
## Clases generales
**DialogueController**

**TransitionController**

Controller de transiciones.

![TransitionController](images/Arquitectura/TransitionController.png)

**SkipButton**

Controller/Helper del DialogueController.

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

    SkipButton --|> PhaserGameObjectImage : inherits
    SkipButton --> DialogueController : controls
```

**AchievementManager**

Manager para los logros.

![AchievementManager](images/Arquitectura/AchievementManager.png)

**RandomNumber**

Tiene solo un método estático que devuelve un número aleatorio dentro del intervalo dado.

![RandomNumber](images/Arquitectura/RandomNumber.png)

## Escenas

### Base Scene

### Loading Scene

### Intro

### Start

### Credits Scene

### Settings Scene

### Option Menu Scene

### Help Lobby Scene

### Items Scene
Escena con todos los logros. Si haces click en uno, se abre una escena que muestra toda la información sobre dicho logro.

![ItemsScene](images/Arquitectura/ItemsScene.png)

### Confirm Menu Scene

### Selection Menu Scene

### Game Mode Selection Scene

### Game Completed

### TimeboxedDefeat

## Juegos

### Aseb
Todas las escenas del juego Aseb en Egipto

- IntroAsebScene: Escena de introducción a Egito donde el jugador conoce a Anubis.
Contiene solo dialogos y Skip Button.
- TutorialAsebScene: La escena que contiene el tutorial para el Aseb
Contiene solo dialogos y Skip Button.
- AsebBeginScene: Escena donde se determina el jugador que empieza.
- AsebScene: Escena donde se da el juego de Aseb
- AsebVictoryScene: Escena con dialogos para cuando el jugador gana la partida
- AsebDefeatScene: Escena con dialogos para cuando el jugador pierde la partida.

FLOWCHART de las escenas de Aseb:

```mermaid
flowchart TD
    A[/IntroAseb/] -->|Dialogo Termina| C{Confirm Menu}
    C -->|Click en YES| D[/TutorialAseb/]
    D -->|Dialogo Termina| F[AsebBegin]
    C -->|Click en NO| F
    F -->|Se decide el primer jugador| G(AsebScene)
    G -->|PEl jugador gana| H[/AsebVictoryScene/]
    G -->|El jugador pierde| I[/AsebDefeatScene/]
    I -->|Modo Timeboxed| J(Start)
    I -->|Modo Normal| F
    H --> SelectionMenu
```
Diagramas de las escenas:

IntroAseb:

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

    IntroAseb --|> BaseScene : inherits
    IntroAseb --> DialogueController : uses
    IntroAseb --> SkipButton : uses
    IntroAseb --> TransitionController : uses
```
TutorialAseb:

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

    TutorialAseb --|> BaseScene : inherits
    TutorialAseb --> DialogueController : uses
    TutorialAseb --> TransitionController : uses

```

AsebBeginScene:

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

    AsebBeginScene --|> BaseScene : inherits
    AsebBeginScene --> AsebGame : instantiates
    AsebBeginScene --> TransitionController : uses

```
AsebScene:

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

    AsebScene --|> BaseScene : inherits
    AsebScene --> AsebGame : instantiates
    AsebScene --> AsebBoard : instantiates
    AsebScene --> TransitionController : uses

```
AsebVictoryScene:

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

    AsebVictoryScene --|> BaseScene : inherits
    AsebVictoryScene --> DialogueController : uses
    AsebVictoryScene --> SkipButton : uses
    AsebVictoryScene --> TransitionController : uses


```

AsebDefeatScene:

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

    AsebDefeatScene --|> BaseScene : inherits
    AsebDefeatScene --> DialogueController : uses
    AsebDefeatScene --> SkipButton : uses
    AsebDefeatScene --> TransitionController : uses


```

### Tali
Todas las escenas del juego Tali.

- TaliIntroScene: La escena de introducción. Contiene solo los diálogos.
- TaliTutorialScene: La escena que contiene el tutorial para Tali.
- TaliBeginScene: La escena donde se determina el jugador que empieza.
- TaliScene: La escena del propio juego.
- DistractMercuryScene: La escena donde el jugador intenta distraer a Mercury.
- CombinationMenu: La escena donde se muestran las posibles combinaciones. Aparece encima de la escena del juego.
-  TaliEndScene: La escena final del juego.

![TaliFlowchart](images/Arquitectura/TaliFlowChart.png)
![TaliScenes](images/Arquitectura/TaliScenes.png)

### Hanafuda