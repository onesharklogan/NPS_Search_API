'use strict';

const searchURL = 'https://api.nps.gov/api/v1/parks';
const apiKey = 'NqRn0Nrc09n3vgWsb3jxKI3rRFEtIn6EZKP81ZRG';

function formatParameters(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
    console.log(responseJson);
    //clear the results so we can repopulate
    $(`#results-list`).empty();

    for (let i = 0; i < responseJson.data.length; i++) {
        console.log("park url:" + responseJson.data[i].url);
        $(`#results-list`).append(
            `<li><p><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></p>
            <p>${responseJson.data[i].description}</p>
            <p>Address: </br>
            ${responseJson.data[i].addresses[0].line1}
            </br>
            ${responseJson.data[i].addresses[0].city}
            </br>
            ${responseJson.data[i].addresses[0].stateCode}
            
            </p></li>`
        );
        // $(`#results-list`).append(
        //     `<li><p><a href="${responseJson[i].data[i].url}">${responseJson.data[i].fullName}</a></p>
        //     </li>`
        // )
    }

    $('#results').removeClass('hidden');
}

function getParks(stateName, maxResults) {
    //clear error warning text
    $('#js-error').empty();

    const params = {
        stateCode: stateName,
        limit: maxResults,
        api_key: apiKey
    }

    const url = searchURL + "?" + formatParameters(params);
    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                console.log("response ok!");
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error').text(`Error occurred during lookup: ${err.message}`);
        });
}

function watchForm() {
    $('form').submit(event => {

        event.preventDefault();
        const stateName = $('#state-name').val();
        const maxResults = $('#max-results').val();

        getParks(stateName, maxResults);
    });
}

$(watchForm);