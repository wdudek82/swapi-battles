# SWAPI Battles

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute [Cypress](https://www.cypress.io/) end-to-end tests.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Docker (prod)

### Build image
```shell
docker image build -t swapi-battles-fe-prod .
```

### Run container
```shell
docker run -p 4200:80 swapi-battles-fe-prod
```

## To do
- [x] initial configuration and setup
  - [x] add Prettier
  - [x] add Cypress
  - [x] add Angular Material
- [x] Select random people or starships from SWAPI
  - [x] aggregate items categories UIDs on application startup,
  - [x] select two random items UIDs of the selected type,
  - [x] use selected UIDs to make a request and fetch items data,
- [x] render their detail to see who would win based on a common attribute (higher value wins),
  - [x] mass for person
  - [x] crew for starship
- [x] render the attributes from the resource in a simple web page that allows
   you to 'play' the game,
- [x] ~~once two cards are displayed~~ once two card are displayed, and the user clicks "Fight!", button the app should declare one of the cards a winner based on
   the higher common attribute, (reason: changed for UX reasons)
- [x] having displayed the winning card, the user should be able to play again using an action
   button that repeats the same request.
- [x] include e2e tests (scenarios in section: "e2e test scenerios")
- [x] include unit tests (scenarios in section: "Unit tests test scenarios")

## Additional
- [x] keep scores of all battles,
- [x] add option to select which resource to play against,
- [x] use Angular Material and display the details in a card.

## Other
- [x] add ESLint
- [ ] deploy to GH pages
- [x] include GH workflows:
  - [x] PR checks
  - [ ] [UNFINISHED] automatic deployment to GH pages on merge to master or manual
- [x] add Docker and docker-compose
  - [x] add relevant README instructions

## e2e test scenarios
- [x] main page loaded:
1. page loaded
2. page title
3. header with span "SW-API Battles"
4. "Load game data" button
5. loading box

- [x] data preloading failure:
1. button still active but its label is changed
2. error toast visible

- [x] load game data button clicked (success):
1. loading button disabled
2. loader visible in the button
3. loading window contains logs

- [x] loading finished:
1. loading button clicked
2. when loading done:
  - loading screen is not visible
  - game board screen is visible

- [x] game board loaded:
1. visible: h1 containing: "Select units type and start the battle!"
2. visible: 3 buttons:
  - Prepare people - enabled
  - Prepare starships - enabled
  - Fight! - disabled
3. no player cards visible in the players-cards-container

- [x] Prepare people/starships button clicked:
1. all three buttons disabled during loading
2. Prepare people button contains spinner

- [x] "People"/"Starships" units loaded:
1. two app-player-card of the correct type visible
2. three buttons are now enabled, no loading

- [x] "Fight!" button clicked:
1. "Fight!" button disabled, two "Prepare" buttons enabled
2. player cards styles updated
3. scores in cards updated

- [x] Player cards reloaded successfully
1. select people cards
2. people cards selected
3. click selecting starships cards
4. confirm that new cards are have been loaded

# Unit tests test scenarios
..

## Comments
When "Load game data" button is clicked, application tries to fetch all items list pages for people and starships from SW API.
I decided to do that because esp. in case of spaceships UIDs are not sequential. There are gaps between them, so I couldn't infere e.g. from `total_count` what UIDs can be used.
The other solution I considered was to use `total_count` to get the general idea of how many items are there, but I quickly discarded this idea because `total_count` of 5 could as well mean that these potential items have ids e.g.: 1, 15, 1000, etc.

When initial game data is loaded I'm showing loaded objects in a small box because I feel that spinner alone would not be a sufficient feedback to the user.
In the improved version I would replace box and the spinner with e.g. progress bar.

To improve the present mechanism I would cache the preloaded items list in localStorage which would improve the project in two ways:
1. initial load time,
2. wait time for individual units (because currently after each battle I'm storing properties of known unit on the preloaded items list).

I decided to add the `Fight!` button to delay showing battle results, after selected units are loaded, just for fun.
