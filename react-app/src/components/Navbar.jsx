import './Navbar.css';

export default function Navbar() {
    return (
        <nav className={'navbar'}>
            <div className='navbar-logo'>
                Nova's Legacy <span className={'logo-dot'}>.</span>
            </div>
            <ul className={'nav-links'}>
                <li><a href={"#mission"}>Our Mission</a></li>
                <li><a href={"#species"}>The Animals</a></li>
                <li><a href={"#stats"}>Impact</a></li>
                <li><a href={"#stories"}>Stories</a></li>
            </ul>
            <a href={"#adopt"} className={'btn-adopt'}>Adopt an Animal</a>
        </nav>
    );
}