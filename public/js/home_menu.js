(() => {
	let menu = qs('aside.left .menu');

	if(menu && menu[0]) {
		let els = menu[0].children;

		for(let i = 0; i < els.length; i++) {
			if(els[i].classList.contains('expand')) {
				els[i].onclick = e => {
					if(!e.target.href) {
						e.preventDefault();
					}

					els[i].classList.toggle('active');
				}
			}
		}
	}
})();