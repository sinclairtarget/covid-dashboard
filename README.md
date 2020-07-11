# COVID Dashboard Exercise
A data visualization intended for a future historian.

## Running Locally
From the `app` folder, run:

```
$ yarn install
$ yarn serve
```

You should then be able to view the visualization via localhost.

## Data Analysis / Cleaning
The [generate.py](./generate.py) script takes the data provided by the New York
Times and transforms it into the JSON file that drives the visualization. To
run the script and replace the JSON file, you first need to install the Python
dependencies using `Pipenv`:

```
$ pipenv install
```

You can then run the script with:
```
$ pipenv run python generate.py > app/dist/data.json
```
