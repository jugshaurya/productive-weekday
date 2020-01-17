### Idea

- To make those racing cars bar-chart of youtube that people make to earn money in excel or tabuleau, but we are goiing to make it using code!!
- Much thanks to https://observablehq.com/@d3/bar-chart-race
  https://observablehq.com/@d3/bar-chart-race-explained
  https://observablehq.com/@johnburnmurdoch/bar-chart-race

- Goal In Mind
- Find the most productive week day of your github from the day a person joined the github

* Tech Stack

  - React
  - D3.js (v5)
  - Dataset year wise

    - we have a year wise list of things
    - for each year we have several list of things, with a property that will help in showing the rank of that thing in that year.

* My Dataset

  - will be using cherrio to fetch the data of day wise contribution-count from the github page
  - Not using github api to fetch users data

### STEPS:

- Get the user data to get the joining date

  1. Get User info + scrapUrls

  - [x] https://api.github.com/users/jugshaurya: (get user joined year)
  - [x] get the year of joining from this let say `yyyy`
  - [x] calculate the diff of yyyy and today year let day `d`

  2. Dates are something weird while fetching svg of user contribution for github main page

  - [x] Generate the urls in an array to do scrapping later on over each url

    - https://github.com/users/jugshaurya/contributions?from=`yyyy`-12-01&to=``yyyy``-12-31
    - this will give result from `yyyy-1`-12-31 to `yyyy`-12-31

    ```
    https://github.com/users/jugshaurya/contributions?from=`yyyy+i`-12-01&to=`yyyy+i`-12-31
    ... for i = 0 to i<=d
    ```

3. generate the dataset from scrapUrls after step 2

- [x] Retrieve the rect tag elements and get date-count and data-date values
- [x] Create a dataset around it and return to front end
- [x] Done!

4. Plot the Result as race bar graph to see the most productive Week Day

- generated a random dataset using utils/generateRandomData.js file check it out !!

### What is D3 ?

- D3 stands for Data-Driven Documents and is widely used to create interactive data visualizations on the web.
- The way most people use D3 with React is to use React to build the structure of the application, and to render traditional HTML elements, and then when it comes to the data visualization section, they pass a DOM container (typically an <svg> ) over to D3 and use D3 to create and destroy and update elements.
  -D3 helps you bring data to life using SVG, Canvas and HTML. D3 combines powerful visualization and interaction techniques with a data-driven approach to DOM manipulation, giving you the full capabilities of modern browsers and the freedom to design the right visual interface for your data.

## Thank you

- https://github.com/cheeriojs/cheerio
- https://www.sitepoint.com/best-javascript-charting-libraries/

  - d3 won , thnks to first comment :)

- https://github.com/d3/d3
- https://observablehq.com/@d3/bar-chart-race
- Github Scarping Policy ( https://help.github.com/en/github/site-policy/github-acceptable-use-policies#5-scraping-and-api-usage-restrictions)
- https://www.tutorialsteacher.com/d3js/create-bar-chart-using-d3js

## D3 doc help

-https://devdocs.io/d3~5/d3-scale#scaleBand
