function menuToggle(event) {
	const navbarSecond = document.querySelectorAll('.navbar-second');
	const menuButton = event.target;

	navbarSecond.forEach( nav => {
		nav.classList.toggle('navbar-second-hidden');
	})

	if(navbarSecond[0].classList.contains('navbar-second-hidden')){
		menuButton.src = "/media/images/menu-open.svg";
	} else {
		menuButton.src = "/media/images/menu-close.svg";
	}
}

document.querySelector('.navbar-menu-button').addEventListener('click', menuToggle);