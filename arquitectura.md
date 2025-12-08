# Arquitectura de Timeboxed
## Clases generales
**DialogueController**

**TransitionController**

Controller de transiciones.

![TransitionController](images/Arquitectura/TransitionController.png)

**SkipButton**

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