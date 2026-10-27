import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;

// o script inline do Layout so marca .has-anim quando o usuario aceita movimento;
// sem a classe o conteudo ja esta visivel por CSS e nada aqui precisa rodar
if (root.classList.contains("has-anim")) {
	root.dataset.animReady = "true";

	// sem o clamp padrao do GSAP: em aba de segundo plano (ou em qualquer contexto
	// com requestAnimationFrame estrangulado) os quadros passam de 500ms e o
	// lagSmoothing faria o conteudo escondido levar dezenas de segundos para
	// aparecer. Desligado, a animacao segue o relogio real e sempre conclui.
	gsap.ticker.lagSmoothing(0);

	const DUR = 0.75;
	const EASE = "power3.out";

	// estado inicial: a opacidade ja vem zerada do CSS, aqui entra so o deslocamento
	gsap.set("[data-anim]", { y: 26 });
	gsap.set('[data-anim="hero-stage"]', { y: 34, scale: 0.975 });

	// --- entrada do hero, imediata e sem depender de scroll ---
	const tl = gsap.timeline({ defaults: { ease: EASE } });

	tl.to('[data-anim="hero"]', { y: 0, opacity: 1, duration: DUR, stagger: 0.08 })
		.to(
			'[data-anim="hero-stage"]',
			{ y: 0, scale: 1, opacity: 1, duration: 1 },
			"-=0.5"
		)
		.to(
			'[data-anim="hero-phone"]',
			{ y: 0, opacity: 1, duration: 0.7 },
			"-=0.65"
		);

	// --- revelacoes no scroll ---
	// nao usa IntersectionObserver nem posicoes pre-calculadas: ao saltar para uma
	// ancora do menu o elemento atravessa a janela entre dois quadros e o
	// cruzamento nunca e amostrado, deixando a secao invisivel para sempre.
	// Aqui a posicao e lida ao vivo a cada scroll, entao nenhum salto escapa.
	type Grupo = { items: HTMLElement[]; stagger: number };
	const pendentes: Grupo[] = [];

	const registrar = (selector: string, stagger = 0) => {
		const grupos = new Map<Element, HTMLElement[]>();

		gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
			// irmaos entram juntos, em cascata
			const pai = el.parentElement ?? el;
			const lista = grupos.get(pai) ?? [];
			lista.push(el);
			grupos.set(pai, lista);
		});

		grupos.forEach((items) => pendentes.push({ items, stagger }));
	};

	registrar('[data-anim="reveal"]');
	registrar('[data-anim="stagger"]', 0.08);

	let agendado = false;

	const verificar = () => {
		agendado = false;
		const limite = window.innerHeight * 0.92;

		for (let i = pendentes.length - 1; i >= 0; i--) {
			const { items, stagger } = pendentes[i];
			if (items[0].getBoundingClientRect().top >= limite) continue;

			pendentes.splice(i, 1);
			gsap.to(items, {
				y: 0,
				opacity: 1,
				duration: DUR,
				ease: EASE,
				stagger
			});
		}

		if (!pendentes.length) {
			window.removeEventListener("scroll", aoRolar);
			window.removeEventListener("resize", aoRolar);
		}
	};

	const aoRolar = () => {
		if (agendado) return;
		agendado = true;
		requestAnimationFrame(verificar);
	};

	window.addEventListener("scroll", aoRolar, { passive: true });
	window.addEventListener("resize", aoRolar);
	verificar();

	// --- profundidade: o painel desliza um pouco mais devagar que a pagina ---
	const dashboard = document.querySelector(".dashboard-window");
	if (dashboard) {
		gsap.to(dashboard, {
			y: -34,
			ease: "none",
			scrollTrigger: {
				trigger: ".hero",
				start: "top top",
				end: "bottom top",
				scrub: 0.6
			}
		});
	}

	// --- header ganha relevo depois que a pagina sai do topo ---
	const header = document.querySelector("header");
	if (header) {
		ScrollTrigger.create({
			start: "top -90",
			onToggle: (self) => header.classList.toggle("is-scrolled", self.isActive)
		});
	}

	// imagens e fontes mudam a altura do documento depois do primeiro calculo
	window.addEventListener("load", () => {
		ScrollTrigger.refresh();

		// imagens carregadas mudam a posicao de tudo que vem depois
		verificar();
	});
}
