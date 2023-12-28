document.addEventListener("DOMContentLoaded", function () {
    
    function fetchData() {
        
        $.getJSON('https://my.api.mockaroo.com/users.json?key=c9ee0f00', function (data) {
            displayData(data);
            createCharts(data);
        });
    }

    
    function displayData(data) {
        var dataContainer = document.getElementById('data-container');
        dataContainer.innerHTML = '<h2>Data</h2>';

        
        var tableHTML = '<table><tr><th>Name</th><th>Country</th><th>Gender</th><th>City</th><th>Age</th></tr>';
        data.forEach(function (item) {
            tableHTML += `<tr><td>${item['First name']} ${item['Last name']}</td><td>${item['Country']}</td><td>${item['Gender']}</td><td>${item['City']}</td><td>${item['Age']}</td></tr>`;
        });
        tableHTML += '</table>';
        dataContainer.innerHTML += tableHTML;
    }

    
    function createCharts(data) {
        var chartsContainer = document.getElementById('charts-container');

        
        var countries = data.map(item => item['Country']);
        var genders = data.map(item => item['Gender']);
        var cities = data.map(item => item['City']);
        var ages = data.map(item => item['Age']);

        
        createBarChart('People', countries, chartsContainer, 'barChartCountries');
        createExplanation('barChartCountriesExplanation', 'Most popular countries', 'This chart shows which countries are more popular future destinations and how many people would like to ho there.');

        
        createPieChart('Genders', genders, chartsContainer, 'pieChartGenders');
        createExplanation('pieChartGendersExplanation', 'Genders Chart', 'This chart represents the distribution of genders.');

        
        createDoubleBarChart('Ages by Gender', data, chartsContainer, 'doubleBarChartAgesByGender');
        createExplanation('doubleBarChartAgesByGenderExplanation', 'Ages by Gender Chart', 'This chart displays the number of people of different ages, segregated by gender.');
    }
    
    
     
     
     
      
    function createExplanationAndChart(explanationContainerId, heading, text, chartId, data) {
        var explanationContainer = document.createElement('div');
        explanationContainer.id = explanationContainerId;
        explanationContainer.innerHTML = `<h2>${heading}</h2><p>${text}</p>`;
        chartsContainer.appendChild(explanationContainer);

        
        switch (chartId) {
            case 'barChartCountries':
                createBarChart(heading, data, chartsContainer, chartId);
                break;
            case 'pieChartGenders':
                createPieChart(heading, data, chartsContainer, chartId);
                break;
            case 'doubleBarChartAgesByGender':
                createDoubleBarChart(heading, data, chartsContainer, chartId);
                break;
            
        }
    }



    
    function createBarChart(label, data, container, chartId) {
        var canvas = document.createElement('canvas');
        canvas.id = chartId;
        container.appendChild(canvas);

        var ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from(new Set(data)),
                datasets: [
                    {
                        label: label,
                        data: data.reduce((acc, item) => {
                            acc[item] = (acc[item] || 0) + 1;
                            return acc;
                        }, {}),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                
            }
        });
    }

    
    function createPieChart(label, data, container, chartId) {
        var canvas = document.createElement('canvas');
        canvas.id = chartId;
        container.appendChild(canvas);

        var ctx = canvas.getContext('2d');
        var uniqueData = Array.from(new Set(data));
        var dataCounts = uniqueData.map(gender => data.filter(item => item === gender).length);

        new Chart(ctx, {
            type: 'doughnut', 
            data: {
                labels: uniqueData,
                datasets: [
                    {
                        label: label,
                        data: dataCounts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(188, 156, 176)',
                            'rgba(185, 250, 248)',
                            'rgba(111, 45, 189)',
                            'rgba(251, 75, 78)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(188, 156, 176)',
                            'rgba(185, 250, 248)',
                            'rgba(111, 45, 189)',
                            'rgba(251, 75, 78)',

                            
                            
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                
            }
        });
    }

    
    function createDoubleBarChart(label, data, container, chartId) {
        var canvas = document.createElement('canvas');
        canvas.id = chartId;
        container.appendChild(canvas);

        var ctx = canvas.getContext('2d');

        
        var genderAgeCounts = {};
        data.forEach(item => {
            if (!genderAgeCounts[item.Gender]) {
                genderAgeCounts[item.Gender] = {};
            }
            genderAgeCounts[item.Gender][item.Age] = (genderAgeCounts[item.Gender][item.Age] || 0) + 1;
        });
        var colors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(188, 156, 176)',
            'rgba(185, 250, 248)',
            'rgba(111, 45, 189)',
            'rgba(251, 75, 78)'
        ];
        
        var uniqueAges = Array.from(new Set(data.map(item => item.Age)));
        var uniqueGenders = Array.from(new Set(data.map(item => item.Gender)));

        
        var datasets = uniqueGenders.map(gender => {
            return {
                label: gender,
                data: uniqueAges.map(age => genderAgeCounts[gender][age] || 0),
                backgroundColor: getRandomColor(),
                borderColor: getRandomColor(),
                borderWidth: 1
            };
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: uniqueAges.map(String),
                datasets: datasets
            },
            options: {
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        callback: function (value) {
                            if (value % 1 === 0) {
                                return value;
                            }
                            return null;
                        }
                    }
                }
            }
        });
    }

    
    function createExplanation(containerId, heading, text) {
        var explanationContainer = document.createElement('div');
        explanationContainer.id = containerId;
        explanationContainer.innerHTML = `<h2>${heading}</h2><p>${text}</p>`;
        document.getElementById('charts-container').appendChild(explanationContainer);
    }

    
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    

    
    document.getElementById('loadDataButton').addEventListener('click', function () {
        
        document.getElementById('data-container').innerHTML = '';
        document.getElementById('charts-container').innerHTML = '';

        
        fetchData();
    });
    
    fetchData();
});
