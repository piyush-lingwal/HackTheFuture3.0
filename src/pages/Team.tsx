import { useEffect } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
const facultyMembers = [
  { name: 'HOD', role: 'Convener', image: '/team/sandeep_kumar.png' },
  { name: 'Mr. Sharadh Pratap Singh', role: 'Co-Convener', image: '' },
]

const teamMembers = [
  { name: 'Gaurav Shukla', role: 'Lead Organiser', image: '/team/gaurav_shukla.webp' },
  { name: 'Chetan Pandey', role: 'Lead Organiser', image: '/team/chetan_pandey.webp' },
  { name: 'Smriti Bisht', role: 'Lead Organiser', image: '/team/smriti_bisht.webp' },
  { name: 'Piyush Lingwal', role: 'Tech lead', image: '/team/piyush_lingwal.webp' },
  { name: 'Prashant Krishan Bharti', role: 'Secretary', image: '/team/Prashant_Krishan_Bharti.webp' },
  { name: 'Prakriti', role: 'Treasurer', image: '/team/prakriti.webp' },
  { name: 'Rishanshu Tripathi', role: 'Web master', image: '/team/Rishanshu_Tripathi.webp' },
  { name: 'Jasan Dikshit', role: 'PR & Outreach Head', image: '/team/Jasan.webp' },
  { name: 'Prince', role: 'Event Head', image: '/team/prince.webp' },
  { name: 'Aaditya', role: 'Co Event Head', image: '/team/aaditya.webp' },
  { name: 'Tabeer Hussain', role: 'Media Head', image: '/team/Tabeer_hussain.webp' },
  { name: 'Nikhil', role: 'Co Techincal Lead', image: '/team/nikhil.webp' },
  { name: 'Golu Kumar', role: 'Technical Member', image: '/team/Golu.webp' },
  { name: 'Sonali Kumari', role: 'Event Crew', image: '/team/sonali.webp' },
  { name: 'Aditya Rawat', role: 'Technical Member', image: '/team/Aditya_Rawat.webp' },
  { name: 'Harsh', role: 'Technical Member', image: '/team/harsh.webp' },
  { name: 'Keshav Kumar', role: 'PR Member', image: '/team/Keshav_Kumar.webp' },
  { name: 'Piyush Rawat', role: 'Technical Member', image: '/team/piyush_rawat.webp' },
  { name: 'Ritish', role: 'Membership Chair', image: '/team/ritish.webp' },
  { name: 'Swapnil', role: 'Team Member', image: '/team/swapnil.webp' },
]

const getInitials = (name: string) => {
  if (name.toLowerCase() === 'abcd') return 'AB';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) {
    let first = parts[0];
    let second = parts[1];
    if (first.toLowerCase() === 'mr.' || first.toLowerCase() === 'ms.') {
      first = parts[1] || 'M';
      second = parts[2] || parts[1];
    }
    return (first[0] + (second ? second[0] : '')).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function TeamPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    document.querySelectorAll('.team-card, .team-roster-heading').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <main className="team-page">
      <Header />

      {/* Breadcrumb */}
      <nav className="ab-breadcrumb">
        <span className="ab-bc-dot" />
        <span>THE EVENT</span>
        <span className="ab-bc-sep">/</span>
        <span>MEET THE TEAM</span>
      </nav>

      <section className="team-hero">
        <div className="team-hero-grid" aria-hidden="true" />
        <div className="team-hero-orb team-hero-orb--one" aria-hidden="true" />
        <div className="team-hero-orb team-hero-orb--two" aria-hidden="true" />
        <div className="team-shell">
          <p className="eyebrow">09 / The People Behind Hack The Future 3.0</p>
          <h1>MEET THE <span>TEAM.</span></h1>
          <p className="team-hero-copy">
            The makers, mentors, and problem-solvers bringing Hack The Future 3.0 to life.
          </p>
          <div className="team-hero-line"><span /></div>
        </div>
      </section>

      <section className="team-roster">
        <div className="team-shell">
          <div className="team-roster-heading">
            <div>
              <p className="team-section-label">OUR CREW</p>
              <h2>BUILDING THE <span>FUTURE.</span></h2>
            </div>
            <p>Meet the dedicated team shaping an unforgettable hackathon experience.</p>
          </div>

          <div className="faculty-grid">
            {facultyMembers.map((member, index) => (
              <article className="team-card" key={`${member.name}-${index}`}>
                <div className="team-card-image-wrap">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="team-card-image"
                      loading="eager"
                    />
                  ) : (
                    <div className="team-card-initials">
                      {getInitials(member.name)}
                    </div>
                  )}
                </div>
                <div className="team-card-wash" aria-hidden="true" />
                <div className="team-card-content">
                  <h3 className="team-card-name">{member.name}</h3>
                  <span className="team-card-role">{member.role}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <article className="team-card" key={`${member.name}-${index}`}>
                <div className="team-card-image-wrap">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="team-card-image"
                      loading={index > 3 ? 'lazy' : 'eager'}
                    />
                  ) : (
                    <div className="team-card-initials">
                      {getInitials(member.name)}
                    </div>
                  )}
                </div>
                <div className="team-card-wash" aria-hidden="true" />
                <div className="team-card-content">
                  <h3 className="team-card-name">{member.name}</h3>
                  <span className="team-card-role">{member.role}</span>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
