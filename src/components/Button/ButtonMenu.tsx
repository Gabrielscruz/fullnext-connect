interface ButtonMenuProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void;
}
export function ButtonMenu({ isOpen, setIsOpen }: ButtonMenuProps) {
    return (
        <label
        className="btn btn-square swap swap-rotate absolute right-2 top-2 md:hidden"
      >
        {/* this hidden checkbox controls the state */}
        <input type="checkbox" onClick={() => setIsOpen(!isOpen)}/>

        {/* hamburger icon */}
        <svg
          className="swap-on fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 512 512"
        >
          <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
        </svg>

        {/* close icon */}
        <svg
          className="swap-off fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 512 512"
        >
          <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
        </svg>
      </label>
    )
}