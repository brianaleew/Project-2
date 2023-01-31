// Creating Slideshow for Homepage

let i = 0;
let images = [];
let time = 3000;

// Images for Slideshow
images[0] = 'https://cdn.dribbble.com/users/1976516/screenshots/14970626/media/95efa5ee27c49a0fde2206a1f929dc13.png?compress=1&resize=400x300&vertical=top'
images[1] = 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/green-tea_400-237a32b.jpg'
images[2] = 'https://i.insider.com/618d6489596d9b00111885f5?width=700'
images[3] = 'https://i0.wp.com/post.healthline.com/wp-content/uploads/2019/11/Close-Up-Of-Humidifier-At-Home-1296x728-header-1296x728.jpg?w=1155&h=1528'

// Function that changes the images
const imgChange = () => {
    document.slide.src = image[i]
    console.log('Images running')
    if(i < images.length) {
        i++;

    } else {
        i = 0;
    }
    setTimeout('imgChange', time)
} 

window.onload = changeImg();
