import iconArrowDown from "../../assets/icon_arrow_down.svg";
import iconNewPlus from "../../assets/icon_new_plus.svg";
import iconNotification from "../../assets/icon_notification.svg";
import iconProfile from "../../assets/icon_profile.svg";

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.8033 12.8619L11.0335 10.0921C11.7817 9.13992 12.2 7.9491 12.2 6.7C12.2 3.64071 9.7593 1.2 6.7 1.2C3.64071 1.2 1.2 3.64071 1.2 6.7C1.2 9.7593 3.64071 12.2 6.7 12.2C7.9491 12.2 9.13992 11.7817 10.0921 11.0335L12.8619 13.8033C12.9796 13.9211 13.1367 13.9867 13.3026 13.9867C13.4686 13.9867 13.6257 13.9211 13.7434 13.8033C13.8611 13.6856 13.9267 13.5286 13.9267 13.3626C13.9267 13.1966 13.8611 13.0396 13.7434 12.9219L13.8033 12.8619ZM2.8 6.7C2.8 4.5237 4.5237 2.8 6.7 2.8C8.8763 2.8 10.6 4.5237 10.6 6.7C10.6 8.8763 8.8763 10.6 6.7 10.6C4.5237 10.6 2.8 8.8763 2.8 6.7Z" fill="#82878C"/>
    </svg>
);

export const Header = () => {
    return (
        <header className="h-[60px] bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 w-full z-10 gap-4">
            {/* Search bar */}
            <div className="flex-1 max-w-[480px]">
                <label className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-[7px] cursor-text hover:border-gray-200 transition-colors">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Pesquisar no site"
                        className="bg-transparent outline-none w-full text-[13.5px] text-gray-600 placeholder-gray-400"
                    />
                </label>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
                {/* Split button: Nova solicitação + dropdown */}
                <div className="flex items-center border border-[#3ecf8e] rounded-lg overflow-hidden">
                    <button className="flex items-center gap-1.5 px-3 py-[7px] text-sm font-medium text-[#3ecf8e] hover:bg-[#3ecf8e]/5 transition-colors">
                        <img
                            src={iconNewPlus}
                            alt="Nova solicitação"
                            className="w-4 h-4"
                            style={{ filter: "invert(64%) sepia(67%) saturate(415%) hue-rotate(106deg) brightness(97%) contrast(90%)" }}
                        />
                        Nova solicitação
                    </button>
                    <div className="w-px h-5 bg-[#3ecf8e]/40" />
                    <button className="flex items-center px-2 py-[7px] text-[#3ecf8e] hover:bg-[#3ecf8e]/5 transition-colors">
                        <img
                            src={iconArrowDown}
                            alt="Mais opções"
                            className="w-4 h-4"
                            style={{ filter: "invert(64%) sepia(67%) saturate(415%) hue-rotate(106deg) brightness(97%) contrast(90%)" }}
                        />
                    </button>
                </div>

                {/* Notification */}
                <button className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-50">
                    <img src={iconNotification} alt="Notificações" className="w-[18px] h-[18px]" />
                </button>

                {/* User avatar */}
                <button className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center hover:border-gray-200 transition-colors">
                    <img src={iconProfile} alt="Perfil" className="w-4 h-4" />
                </button>
            </div>
        </header>
    );
};
