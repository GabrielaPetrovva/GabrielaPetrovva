document.addEventListener('DOMContentLoaded', function() {
    let slideIndex = 0;
    showSlides();
    
    function showSlides() {
        let i;
        let slides = document.getElementsByClassName("slide");
        
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
            slides[i].style.animation = "";
        }
        
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}
        
        slides[slideIndex-1].style.display = "flex";
        slides[slideIndex-1].style.animation = "fadeIn 1.5s";
        
        setTimeout(showSlides, 4000); // Change image every 4 seconds
    }
});