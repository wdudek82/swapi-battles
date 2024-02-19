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

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## To do
- [x] initial configuration and setup
  - [x] add Prettier
  - [x] add Cypress
  - [x] add Angular Material
- [ ] Select random people or starships from SWAPI
  - [x] aggregate items categories UIDs on application startup,
  - [x] select two random items UIDs of the selected type,
  - [x] use selected UIDs to make a request and fetch items data,
- [x] render their detail to see who would win based on a common attribute (higher value wins),
  - [x] mass for person
  - [x] crew for starship
- [ ] render the attributes from the resource in a simple web page that allows
   you to 'play' the game,
- [ ] once two cards are displayed the app should declare one of the cards a winner based on
   the higher common attribute,
- [ ] having displayed the winning card, the user should be able to play again using an action
   button that repeats the same request.
- [ ] include unit tests
- [ ] include e2e tests

## Additional
- [ ] keep scores of all battles,
- [ ] add option to select which resource to play against,
- [ ] use Angular Material and display the details in a card.

## Other
- [x] add ESLint
- [ ] deploy to GH pages
