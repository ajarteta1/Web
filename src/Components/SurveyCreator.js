import React, { Component } from 'react'
import SurveyCreator from 'survey-creator'








class SurveyC extends Component {





    render() {

        var surveyCreator = new SurveyCreator.SurveyCreator("surveyContainer");
        SurveyCreator.StylesManager.applyTheme("bootstrap");
        if (sessionStorage.length != 0) {
            window.location.href = "/login";
        }
        return (

            <main>
                <head>
                    <title>Use options to customize the Survey Creator, Survey Creator Example</title>

                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min.js"></script>
                    <script src="https://surveyjs.azureedge.net/1.1.17/survey.ko.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/ace.min.js" type="text/javascript" charset="utf-8"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/ext-language_tools.js" type="text/javascript" charset="utf-8"></script>
                    <script src="https://unpkg.com/jquery"></script> <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" /> <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script> -->
                    <link href="https://surveyjs.azureedge.net/1.1.17/survey-creator.css" type="text/css" rel="stylesheet" />
                    <script src="https://surveyjs.azureedge.net/1.1.17/survey-creator.js"></script>
                    <link rel="stylesheet" href="https://unpkg.com/bootstrap@3.3.7/dist/css/bootstrap.min.css" />
                    <link rel="stylesheet" href="./index.css" />

                </head>
                <body>
                    <div id="surveyContainer">
                        <div id="creatorElement"></div>
                    </div>



                </body>


            </main>
        );


    }



}


export default SurveyC