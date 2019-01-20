# RentalCalc

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.1.

## Working with Wordpress
After building (with production tag) the project:
1. All js and css files go into desired child theme directory, in folder named: 'jsEvaluator' and the re-evaluator-template.php file in parent directory
2. Remember to change the hash references on the main, inline, and styles files.
3. In the new page on Wordpress, enqueue the indicated template file
4. May need to adjust routing parameters to catch any added wordpress URL parameters/folders
5. Need to add handling to .htaccess to allow reloading (via redirect of folder structure in url)
6. Add any necessary css to handle merge with main theme styles.css

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
