(() => {
    function fetchVisitData() {
        fetch('/api/visit/get')
            .then(response => response.json())
            .then(data => {
                const todayVisits = data.todayVisits;
                const totalVisits = data.totalVisits;
                
                // Update card with visit data
                updateCardData(todayVisits, totalVisits);
            })
            .catch(error => {
                console.error('Error fetching visit data:', error);
            });
    }
    
    function updateCardData(todayVisits, totalVisits) {
        const dailyVisitorsCard = document.getElementById('dailyVisitorsCard');
        const totalVisitorsCard = document.getElementById('totalVisitorsCard');
        dailyVisitorsCard.querySelector(".card-text").innerHTML = todayVisits;
        totalVisitorsCard.querySelector(".card-text").innerHTML = totalVisits;
    }
    
    window.addEventListener('load', fetchVisitData);
})();