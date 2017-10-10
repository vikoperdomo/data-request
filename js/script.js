function loadData() {

    const $body = $('body');
    const $wikiElem = $('#wikipedia-links');
    const $nytHeaderElem = $('#nytimes-header');
    const $nytElem = $('#nytimes-articles');
    const $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    const $street = $("#street").val();
    const $cityState = $("#cityState").val();
    const $city = $cityState.split(',')[0];
    const address = `${$street}, ${$cityState}`;

    $greeting.text(`So, you want to live at ${address}?`);
    $nytHeaderElem.text(`New York Times Articles About ${$cityState}`);

    const streetviewUrl = `<img class="bgimg" src="https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${address}">`;

    $body.append(streetviewUrl);
    const apiKey = 'c1a798e2cfd9457a8d50decad1fa7774';

    $.getJSON(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${$city}&sort=newest&api-key=${apiKey}`,
        data => {
            const docs = data.response.docs;
            const articles = [];

            $.each(docs, (index, value) => {
                 articles.push(`<li class="article"><a href="${value.web_url}">${value.headline.main}</a><p>${value.snippet}</p>`);
            });

            $(articles.join( " " )).appendTo( $("#nytimes-articles") );
        }).error(() => {
            $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
        }
    );

    const wikiRequestTimeout = setTimeout(() => {
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax(`http://en.wikipedia.org/w/api.php?action=opensearch&search=${$city}&format=json&callback=wikiCallBack`, {
        dataType: "jsonp",
        success(response) {
            console.log(response);
            const articleTitles = response[1];
            const articleLinks = response[3];
            const numberOfArticles = articleLinks.length;
            for(let i = 0; i < numberOfArticles; i++) {
                $wikiElem.append(`<li><a href="${articleLinks[i]}">${articleTitles[i]}</a></li>`);
            }

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
}

$('#form-container').submit(loadData);


