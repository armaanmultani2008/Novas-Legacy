import './Hero.css'

export default function Hero(){
    return (
        <section className={'hero'}>
            <div className={'hero-content'}>
                <span className={'hero-badge'}>Wildlife Conservation</span>
                <h1>Saving Cheetahs, One Spot at a Time</h1>
                <p>
                    Dedicating to protecting cheetahs as a species through specialized care,
                    captive breeding, and giving them a fighting chance for survival in the wild.
                </p>
                <div className={'hero-buttons'}>
                    <a href={'#explore'} className={'btn-primary'}>Explore Center</a>
                    <a href={'#support'} className={'btn-secondary'}>Support Our Mission</a>
                </div>
            </div>
        </section>
    );
}