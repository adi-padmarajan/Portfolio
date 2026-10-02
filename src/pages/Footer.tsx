import {
    BackToTopLink,
    EMAIL,
    FooterColumn,
    FooterLink,
    FooterSignoff,
    NAV_LINKS,
    SOCIAL_LINKS,
} from "../components";

// Sign-off and link columns up top, with a quiet bottom bar beneath them
function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mx-auto max-w-6xl bg-white px-6 md:px-10 lg:px-12">
            <div className="grid gap-12 border-t border-gray-200 pt-16 pb-16 sm:pt-20 md:grid-cols-12 md:gap-6 md:pb-24">
                <div className="md:col-span-5">
                    <FooterSignoff />
                </div>

                <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-6 md:col-start-7 md:gap-6">
                    <FooterColumn label="Navigate">
                        {NAV_LINKS.map((link) => (
                            <FooterLink key={link.href} label={link.label} href={link.href} />
                        ))}
                    </FooterColumn>

                    <FooterColumn label="Connect">
                        {SOCIAL_LINKS.map((link) => (
                            <FooterLink key={link.href} label={link.label} href={link.href} external />
                        ))}
                        <FooterLink label="Email" href={`mailto:${EMAIL}`} />
                    </FooterColumn>

                    <FooterColumn label="Based in">
                        <li className="text-black/70">Vancouver, BC</li>
                        <li className="text-black/70">Canada</li>
                    </FooterColumn>
                </div>
            </div>

            <div className="flex items-center justify-between gap-8 border-t border-gray-200 py-8 text-xs tracking-wide text-gray-400 sm:text-sm">
                <p>&copy; {year} Aditya Padmarajan</p>
                <BackToTopLink />
            </div>
        </footer>
    );
}

export default Footer;
