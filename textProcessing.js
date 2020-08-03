const fetch = require("node-fetch");
// let input = "@bot give me #restaurants #activities"
// var location = "Seattle";
// var count = 2;

// console.log("Here are the results:" + processTweet(input, location, count));
function processTweet(input, location, count) {
  //immediately return help/instructions if #help is present
  if (input.indexOf("#help") >= 0) {
    return "tweet #restaurants to search for restaurants, #hotels, #activities, #travel, #covid19";
  }

  //identify hashtags from tweet
  let hashtags = [];
  if (input.indexOf("#restaurants") >= 0 || input.indexOf("#restaurant") >= 0) {
    hashtags.push("poitype-Restaurant");
  }

  if (input.indexOf("#hotels") >= 0) {
    hashtags.push("hotels");
  }

  if (input.indexOf("#activities") >= 0) {
    hashtags.push("do");
  }

  if (input.indexOf("#museums") >= 0) {
    hashtags.push("subtype-Art_museums");
  }

  if (input.indexOf("#covid19") >= 0) {
    hashtags.push("poitype-Hospital");
  }

  //    console.log(hashtags)

  var promises = [];

  for (tag of hashtags) {
    promises.push(handleFetch(tag, location, count));
  }

    return promises; 
    /*Promise.all(promises).then(function() {
        // console.log(resultsList)
        // return resultsList;
        // })
// return resultsList;*/
}

function handleFetch(tag, location, count) {
    var resultsList = [];

    //formatting of location to url standards
    location = location.replace(" ", "_")
    if (location.indexOf(",") >= 0){
        location = location.substring(0, location.indexOf(","));
    }

    let url = "https://www.triposo.com/api/20200405/poi.json?tag_labels=" + 
        tag + "&location_id=" + location + "&count=" + count + 
        "&account=5UBC3HJA&token=9xzttm97pjneiyan2eyj45uszntfhwgs";
    return fetch(
        url
      )
        .then(function (response) {
        console.log("response:", response)
          return response.json();
        })
        .then(function (data) {
        console.log("data: ", data)
          if (data) {
            for (item of data.results) {
              resultsList.push(item.name);
            }
          }
          return resultsList;
        });
}

exports.processTweet = processTweet;