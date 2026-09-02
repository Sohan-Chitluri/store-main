import { Icons } from "@/components/ui/icons";
import { HOME_PAGE } from "@/lib/constants/page-routes";

export interface NavigationOption {
	id: number;
	name: string;
	href: string;
	icon: typeof Icons.BsCpu;
	testid: string;
	target?: "_self" | "_blank";
}

export const navigationOptions: NavigationOption[] = [
	{
		id: 1,
		name: "Home",
		href: HOME_PAGE,
		icon: Icons.BsCpu,
		testid: "home-nav-link",
	},
	{
		id: 2,
		name: "HardwareScout Demo",
		href: "/demo",
		icon: Icons.BsRocket,
		testid: "demo-nav-link",
	},
];
