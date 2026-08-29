import { Icons } from "@/components/ui/icons";
import { HOME_PAGE } from "@/lib/constants/page-routes";

export const navigationOptions = [
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
