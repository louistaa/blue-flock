const fetch = require('node-fetch');
// let input = "@bot give me #restaurants #activities"
// var location = "Seattle";
// var count = 2;


// console.log("Here are the results:" + processTweet(input, location, count));


function processTweet(input, location, count) {

     //immediately return help/instructions if #help is present
     if (input.indexOf("#help") >= 0)
     {
        return("tweet #restaurants to search for restaurants, #hotels, #activities, #travel, #covid19")
     }

     //identify hashtags from tweet
    let hashtags = []
    if (input.indexOf("#restaurants") >= 0){
        hashtags.push("poitype-Restaurant")

    }

    if (input.indexOf("#hotels") >= 0){
        hashtags.push("hotels")

    }

    if (input.indexOf("#activities") >= 0){
        hashtags.push("do")
    }
    if(input.indexOf("#travel") >= 0)
    {
        hashtags.push("travel")
    }
    if(input.indexOf("#covid19") >= 0)
    {
        hashtags.push("poitype-Hospital")
    }


//    console.log(hashtags)

    var resultsList = []
    var promises = []
    
    for (tag of hashtags){
        var myPromise = fetch(`https://www.triposo.com/api/20200405/poi.json?tag_labels=${tag}&location_id=${location}&count=${count}&account=5UBC3HJA&token=9xzttm97pjneiyan2eyj45uszntfhwgs`)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
      
            if (data) {
          
                for (item of data.results){
                    resultsList.push(item.name)
                }
            }
        })
        promises.push(myPromise)
    }
        Promise.all(promises).then(function() {
        //    console.log('please list plz')
            console.log(resultsList)
            return resultsList;
        })
        return resultsList;
}