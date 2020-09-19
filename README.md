# express-and-react

How to run it:

- go to `react-backend` folder.

  - execute `npm install`
  - run `PORT=3001 node bin/www`

- open a new terminal or a tab in your current terminal
- go to `client` folder inside of `react-backend`
  - run `npm install`
  - run `npm start`

Other tools used:

- JSON generator to get random data: https://www.json-generator.com/

Some thoughts on the process:
Data set was create starting on 19-09-2020, based on that date there are 1000 entries.

Since I have not so much experience with the node.js/express ecosystem I decided to use a JSON file as the "database",
also because of the same reason I did not include any libraries that potentially could process pagination or filtering
and instead I decided to build my own. This lead to some time "wasted" on building the UI for the pagination.

Another reason for this choice is the fact that in the description of the assessment for me was not clear the focus,
should it be light on the backend side and heavier on UI side? There are no points about styling and most of the tasks
are heavier on the backend since usually the frontend would only make a request and get a response back with the data
already paginated and/or filtered.

For the frontend I chose some libraries like react-datepicker to make easier the use of dates.
In this case I feel more comfortable trying out different libraries because I have more working experience on that field.

I did not add tests since there are no references to it in the acceptance criterias but if necessary I can come back to the project
and write some test.
Some examples of frontend testing that I have done in the past can be found in another assessment I did some weeks ago:
https://github.com/daviliano2/typescript-form/blob/master/src/App.test.tsx

Most of the logic is placed in a few files. This approach comes from the principle "Place code as close to where it's relevant as possible".
Source: https://kentcdodds.com/blog/colocation
