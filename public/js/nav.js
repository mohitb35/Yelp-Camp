function menuToggle(event) {
	const navbarSecond = document.querySelectorAll('.navbar-second');
	const menuButton = event.target;
	
	navbarSecond.forEach( nav => {
		nav.classList.toggle('navbar-second-hidden');
	})

	if(navbarSecond[0].classList.contains('navbar-second-hidden')){
		menuButton.innerText = "Show Menu";
	} else {
		menuButton.innerText = "Hide Menu";
	}
}

document.querySelector('.navbar-menu-button').addEventListener('click', menuToggle);