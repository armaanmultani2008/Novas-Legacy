import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AnimalModal from '../components/AnimalModal'
import { useCMSImages } from '../CMSContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const DEFAULTS = {
  hero: '/img/leoni-bliss-thunder.jpg',
}

const FEATURED = [
  { slug: 'cheetahs', key: 'cheetahs', title: 'Cheetahs', img: '/img/ghepardo-erba-alta.png',
    detail: "Built for speed, the cheetah has a light skeleton, semi-retractable claws and a long, flexible spine that lets it reach strides of up to 7 metres at full sprint. Solid black spots and dark \"tear stripes\" running from the eyes to the mouth help cut the sun's glare while hunting. Cheetahs can't roar — instead they chirp, purr and even churr to communicate. Males often form small coalitions for life, while females remain solitary outside of raising cubs. Fewer than 7,000 are estimated to survive in the wild today." },
  { slug: 'horses', key: 'horses', title: 'Horses', img: '/img/cavallo-puledro.png',
    detail: "Every horse on the reserve arrives with a different story — most rescued from neglect, abandonment or situations where they could no longer be cared for. Each is assessed by a vet, treated for any injuries or illness, and gradually rehabilitated through patient, hands-on care and a structured re-training programme. Many were once underweight or distrustful of people; today they graze freely across the reserve alongside cheetahs, wild dogs and zebras, and several have grown calm enough to share quiet moments with visiting volunteers." },
]

const OTHER_SECTIONS = [
  { slug: 'lions', key: 'lions', title: 'Lions', img: '/img/lions.png',
    detail: "Africa's second-largest big cat, the lion is best known for its powerful roar and the thick mane that makes males look larger and helps protect the neck during fights. Lions are the only cat with a tufted tail, used to signal to the rest of the pride during a hunt. Cubs are born with soft spots that fade with age, and the rare white lion's pale coat comes from a genetic condition called leucism. Lions live in tight social groups called prides, with males up to 50% larger than females." },
  { slug: 'tigers', key: 'tigers', title: 'Tigers', img: '/img/tigre-quake-ritratto.jpg',
    detail: "The largest cat in the world, the tiger is a powerful, surprisingly enthusiastic swimmer — one of the few big cats that actively seeks out water. Its bold stripes are unique to every individual and provide near-perfect camouflage when stalking prey through long grass, while fully retractable claws and padded paws keep its approach silent. Genetic variation produces several coat colours, from the classic orange-and-black to rare white, golden and snow-white tigers. Tigers greet one another with a friendly huffing sound called \"chuffing.\"" },
  { slug: 'servals', key: 'servals', title: 'Servals', img: '/img/serval.png',
    detail: "Tall and slender, the serval is one of the tallest small cats in Africa thanks to long legs built for leaping — it can spring up to 3 metres into the air to snatch a bird mid-flight or pounce on prey hidden in tall grass. Its oversized, mobile ears can rotate 180 degrees and pick up the ultrasonic calls of rodents moving underground. Servals have water-resistant fur and often lie in shallow water to stalk passing prey. They are solitary hunters, most active from dusk through the night." },
  { slug: 'caracals', key: 'caracals', title: 'Caracals', img: '/img/lince.png',
    detail: "Known as the desert lynx, the caracal is the largest of Africa's small cats. Long, powerful legs let it leap nearly 3 metres straight up to knock birds clean out of the air, and it climbs trees with ease. The long black tufts on its ears — used to communicate with other caracals — give it a passing resemblance to a lynx, though it's actually more closely related to servals and golden cats. Caracals are solitary, mostly hunting at twilight, and are rarely seen far from cover." },
  { slug: 'civets', key: 'civets', title: 'Civets', img: '/img/african-civet.png',
    detail: "The African civet is easy to recognise by its bold black-and-white spots, stripes and the bandit-like mask around its eyes. Solitary and intensely territorial, it marks its range using scent glands that produce a strong musk. Unlike most mammals, civets have five non-retractable claws on each foot, which helps them climb. Mostly nocturnal, they're omnivores that will eat anything from fruit and insects to small rodents, birds and eggs." },
  { slug: 'porcupines', key: 'porcupines', title: 'Porcupines', img: '/img/porcospino.png',
    detail: "Africa's largest porcupine species is covered in long, hollow quills that rattle loudly in warning when shaken — and form a dramatic crest along the head and neck when raised. Porcupines are largely monogamous, keeping the same mate for life, but forage for food alone after dark and shelter together in multi-chambered underground dens. Despite their fearsome defences, they're gentle herbivores, feeding on bark, roots, fallen fruit and the occasional crop raid." },
  { slug: 'bat-eared-foxes', key: 'bat_eared_foxes', title: 'Bat-Eared Foxes', img: '/img/fox.png',
    detail: "This small African fox is unmistakable thanks to ears that can grow over 5 inches tall — built to keep the fox cool and to pick up the faintest rustle of insects underground. Bat-eared foxes are grey with black markings on the face, legs and tail, and their strong digging claws are used to build the underground dens and tunnel networks they live in. They live and forage together in pairs or small family groups, feeding mostly on termites, beetles and other insects through the night." },
  { slug: 'jackals', key: 'jackals', title: 'Jackals', img: '/img/smokey-jackal.png',
    detail: "Highly adaptable and opportunistic, jackals will hunt alone or in pairs just as readily as they'll scavenge a free meal. Black-backed and side-striped jackals are both found across southern Africa, identifiable by the dark saddle of fur running down the back. They're monogamous for life, with bonded pairs marking and defending a shared territory together, and are best known for their sharp, far-carrying howls — used to keep in contact with their mate and warn off rivals at dusk and through the night." },
  { slug: 'cows', key: 'cows', title: 'Cows', img: '/img/cows.png',
    detail: "Our cattle come from backgrounds of neglect or abandonment, often arriving underweight or in poor health. Once assessed and treated by our veterinary team, they're slowly nursed back to full health and given the run of open grazing land on the reserve. Naturally calm and social, they form small, settled herds and are a familiar, reassuring presence for the volunteers and staff who care for them every day." },
  { slug: 'pets', key: 'pets', title: 'Pets', img: '/img/pets.png',
    detail: "Alongside the wildlife, Nova's Legacy is also home to a small family of rescued cats and dogs, many of whom arrived as strays or were surrendered by owners who could no longer care for them. They live safely on the property, vaccinated, sterilised and well fed, often becoming the first friendly faces volunteers meet on their morning rounds. Each has its own personality and place in the daily life of the reserve." },
  { slug: 'birds', key: 'birds', title: 'Birds', img: '/img/birds.png',
    detail: "The reserve's bushveld habitat supports a striking variety of birdlife, from birds of prey patrolling the skies above the enclosures to small, colourful songbirds darting through the acacia trees below. Some are year-round residents, while others pass through on seasonal migration, drawn by the same water sources and open grassland that sustain the reserve's larger animals. For many visitors, the birdlife is an unexpected highlight of every walk through the bush." },
  { slug: 'free-roaming-animals', key: 'free_roaming_animals', title: 'Free-Roaming Animals', img: '/img/free-roaming.png',
    detail: "Across the reserve's open grassland, giraffes, zebras, antelope and other herbivores roam freely, exactly as they would in the wild. Left largely undisturbed, these free-roaming species play a vital role in keeping the bushveld ecosystem healthy — grazing keeps grasses in balance, while their presence supports the same natural food web that has sustained Waterberg's wildlife for generations. For many guests, spotting a herd moving quietly through the bush is one of the most memorable parts of a visit." },
]

function AnimalsRow({ items, onSelect, justifyCenter }) {
  const { t } = useTranslation()
  const scrollerRef = useRef(null)

  return (
    <div className="oa-row">
      <div className={`oa-scroller ${justifyCenter ? 'justify-center' : ''}`} ref={scrollerRef}>
        {items.map(a => (
          <div key={a.id} className="animal-card" onClick={() => onSelect(a)} style={{ borderRadius: '8px' }}>
            <div className="animal-photo">
              <img style={{width: '100%', objectFit: 'cover', height: '100%', objectPosition: '20% 20%'}} src={a.img} alt={a.name} draggable={false} />
            </div>
            <div className="animal-info">
              <h4>{a.name}</h4>
              <span>{a.role}</span>
              <button
                className="btn btn-outline-dark btn-sm"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.6rem' }}
                onClick={(e) => { e.stopPropagation(); onSelect(a) }}
              >
                {t('our_animals.discover_story', 'Discover their story →')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SpeciesBlock({ section, individuals, onSelect }) {
  const { t } = useTranslation()
  const title = t(`our_animals.${section.key}_title`, section.title)
  const detail = t(`our_animals.${section.key}_detail`, section.detail)
  const titleWords = title.split(' ')

  return (
    <div id={section.slug} className="oa-block">
      <h2>{titleWords.slice(0, -1).join(' ')} <em>{titleWords.slice(-1)}</em></h2>
      <p>{detail}</p>
      {individuals.length === 0
        ? <p className="oa-empty">{t('our_animals.empty_species', 'No animals added for this species yet.')}</p>
        : <AnimalsRow items={individuals} onSelect={onSelect} justifyCenter={individuals.length <= 2}/>
      }
    </div>
  )
}

function OurAnimals({ goTo }) {
  const { t } = useTranslation()
  const cmsImages = useCMSImages()
  const [modalAnimal, setModalAnimal] = useState(null)
  const [roster, setRoster] = useState([])

  useEffect(() => {
    fetch(`${API}/api/cms`)
      .then(r => r.json())
      .then(d => setRoster(d.ourAnimals || []))
      .catch(() => {})
  }, [])

  const bySpecies = {}
  roster.forEach(a => { (bySpecies[a.species] ||= []).push(a) })

  const heroImg = cmsImages.our_animals_hero || DEFAULTS.hero

  const withCms = (section) => ({
    ...section,
    img: cmsImages[`our_animals_${section.key}`] || section.img,
  })

  const featured = FEATURED.map(withCms)
  const otherSections = OTHER_SECTIONS.map(withCms)

  return (
    <>
      <div className="page-hero-img" style={{ height: '75dvh', minHeight: '450px', position: 'relative', overflow: 'hidden' }}>
        <img src={heroImg} alt="Our Animals" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('our_animals.hero_label', '~ Meet the Family ~')}</span>
          <h1>
            {t('our_animals.hero_title', 'Our Animals').split(' ').slice(0, -1).join(' ')}{' '}
            <em>{t('our_animals.hero_title', 'Our Animals').split(' ').slice(-1)}</em>
          </h1>
          <p>{t('our_animals.hero_sub', "Every species at Nova's Legacy has its own story — scroll through to meet the cheetahs, horses and wild family who call the reserve home.")}</p>
        </div>
      </div>

      <div className="page-content" style={{padding: '4rem 1.5rem'}}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <button className="btn btn-dark" onClick={() => goTo('kim-story')}>{t('our_animals.btn1', 'Meet Kim')}</button>
            <button className="btn btn-outline-dark" onClick={() => goTo('adopt')}>{t('our_animals.btn2', 'Adopt an Animal')}</button>
          </div>

          <p>{t('our_animals.intro_p1', "From the cheetahs at the heart of our mission to the horses, predators and free-roaming herbivores who share the reserve with them, every animal here has found a safe place to belong. Scroll through each species below and discover their stories.")}</p>

          {featured.map(section => (
            <SpeciesBlock key={section.slug} section={section} individuals={bySpecies[section.key] || []} onSelect={setModalAnimal} />
          ))}

          <hr className="oa-hr" />
          <h2><em>{t('our_animals.other_title', 'Other Animals')}</em></h2>
          <p>{t('our_animals.other_desc', "Beyond cheetahs and horses, Nova's Legacy is home to a wide family of rescued wildlife and farm animals — lions, tigers, small wild cats, free-roaming herbivores and more, each with a sanctuary built around their needs.")}</p>

          {otherSections.map(section => (
            <SpeciesBlock key={section.slug} section={section} individuals={bySpecies[section.key] || []} onSelect={setModalAnimal} />
          ))}
        </div>
      </div>

      <style>{`
        .oa-block {
          margin-top: 4.5rem;
        }
        .oa-hr {
          border: none;
          border-top: 1px solid rgba(0,0,0,0.1);
          margin: 4.5rem 0 0;
        }
        .oa-empty {
          color: #999;
          font-style: italic;
        }
        .oa-row {
          position: relative;
          margin: 0 !important;
        }
        .oa-scroller {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding-bottom: 1.2rem;
          margin: 0 -3.5rem;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
        }
        .oa-scroller::-webkit-scrollbar { height: 6px; }
        .oa-scroller::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
        .oa-scroller::-webkit-scrollbar-thumb { border-radius: 10px; background: rgba(0, 0, 0, 0.2); transition: 0.2s; }
        .oa-scroller::-webkit-scroller-thumb::hover { background: var(--gold, #c5a880); }
        .oa-scroller.justify-center {
          justify-content: center;
          margin: 0;
          padding: 0 0 1.2rem 0;
        }
        @media (max-width: 820px){
          .oa-scroller.justify-center {
            justify-content: flex-start;
            margin: 0 -2rem;
            padding: 0:
          }
        }
        @media (max-width: 640px) {
          .oa-scroller, 
          .oa-scroller.justify-center { 
            padding: 0; margin: 0 -2.2rem; gap: 1rem; justify-content: flex-start;
          }
          .animal-card { 
            scroll-snap-align: center; flex-shrink: 0; width: 82vw; flex-shrink: 0; max-width: 100%;
          }
        }
      `}</style>

      {modalAnimal && (
        <AnimalModal
          animal={{
            name: modalAnimal.name,
            role: modalAnimal.role,
            bio: modalAnimal.bio,
            img: modalAnimal.img,
            gallery: modalAnimal.extraImages?.length ? modalAnimal.extraImages : (modalAnimal.extraImg ? [modalAnimal.extraImg] : []),
          }}
          onClose={() => setModalAnimal(null)}
        />
      )}
    </>
  )
}

export default OurAnimals
