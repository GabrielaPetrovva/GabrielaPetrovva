        // Симулация на дозиметър
        function updateDosimeter() {
            const base = 0.12;
            const random = Math.random() * 0.05;
            const value = (base + random).toFixed(2);
            document.querySelector('.dosimeter-display').textContent = value;
            setTimeout(updateDosimeter, 2000);
        }

        // При зареждане на страницата
        document.addEventListener('DOMContentLoaded', function() {
            updateDosimeter();
        });