import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Phone, Navigation, MessageCircle, Globe } from 'lucide-react'
import { supabase } from '../lib/supabase'

const CATEGORIES = [
  { label: 'Restaurantes', emoji: '🍕', query: 'restaurante' },
  { label: 'Cafeterias', emoji: '☕', query: 'cafeteria' },
  { label: 'Lanchonetes', emoji: '🍔', query: 'lanchonete' },
  { label: 'Sushi', emoji: '🍣', query: 'restaurante japonês' },
  { label: 'Bares', emoji: '🍺', query: 'bar' },
  { label: 'Adegas', emoji: '🍹', query: 'adega' },
  { label: 'Hotéis', emoji: '🏨', query: 'hotel' },
  { label: 'Postos', emoji: '⛽', query: 'posto de gasolina' },
  { label: 'Mecânicas', emoji: '🚗', query: 'oficina mecânica' },
  { label: 'Borracharias', emoji: '🔧', query: 'borracharia' },
  { label: 'Táxis', emoji: '🚕', query: 'ponto de táxi' },
  { label: 'Hospitais', emoji: '🚑', query: 'hospital' },
  { label: 'Farmácias', emoji: '💊', query: 'farmácia' },
  { label: 'Academias', emoji: '🏋️', query: 'academia' },
  { label: 'Dentistas', emoji: '🦷', query: 'dentista' },
  { label: 'Médicos', emoji: '👨‍⚕️', query: 'clínica médica' },
  { label: 'Salões', emoji: '💇', query: 'salão de beleza' },
  { label: 'Barbearias', emoji: '💈', query: 'barbearia' },
  { label: 'Pet Shops', emoji: '🐶', query: 'pet shop' },
  { label: 'Veterinários', emoji: '🐕', query: 'veterinário' },
  { label: 'Escolas', emoji: '📚', query: 'escola' },
  { label: 'Advogados', emoji: '⚖️', query: 'advogado' },
  { label: 'Bancos', emoji: '🏦', query: 'banco' },
  { label: 'Mercados', emoji: '🛒', query: 'mercado' },
  { label: 'Lojas', emoji: '🛍️', query: 'loja' }
]

function formatDistance(meters) {
  if (meters == null) return ''
  if (meters < 1000) return `${meters} m`
  return `${(meters / 1000).toFixed(1)} km`
}

export default function GuiaPage() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [location, setLocation] = useState(null)
  const [locationDenied, setLocationDenied] = useState(false)
  const searchedOnceRef = useRef(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationDenied(true),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  async function runSearch(query) {
    if (!query.trim()) return
    if (!location) {
      setError('Precisamos da sua localização para buscar lugares perto de você.')
      return
    }
    setLoading(true)
    setError('')
    searchedOnceRef.current = true
    try {
      const { data, error: fnError } = await supabase.functions.invoke('places-search', {
        body: { query, lat: location.lat, lng: location.lng }
      })
      if (fnError) throw fnError
      setResults(data.results || [])
    } catch (err) {
      console.error('Erro ao buscar lugares:', err)
      setError('Não foi possível buscar agora. Tenta de novo em instantes.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    runSearch(search)
  }

  function handleCategoryClick(cat) {
    setSearch(cat.label)
    runSearch(cat.query)
  }

  function directionsUrl(place) {
    return `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>📍 Guia Fala Tu</h2>
        <p style={s.subtitle}>Encontre lugares perto de você</p>
      </div>

      <form style={s.searchBar} onSubmit={handleSubmit}>
        <Search size={18} color="#606080" />
        <input
          style={s.searchInput}
          placeholder="Restaurante, borracharia, pet shop..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <div style={s.categories}>
        {CATEGORIES.map((cat) => (
          <button key={cat.label} style={s.categoryChip} onClick={() => handleCategoryClick(cat)}>
            <span style={s.categoryEmoji}>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div style={s.results}>
        {locationDenied && (
          <div style={s.notice}>
            <MapPin size={16} color="#F87171" />
            <span>Ative a localização do navegador para buscar lugares perto de você.</span>
          </div>
        )}

        {error && <div style={s.notice}>{error}</div>}

        {loading && <div style={s.centered}><p style={{ color: '#606080' }}>Buscando...</p></div>}

        {!loading && searchedOnceRef.current && results.length === 0 && !error && (
          <div style={s.centered}><p style={{ color: '#606080' }}>Nenhum resultado encontrado.</p></div>
        )}

        {!loading && results.map((place) => (
          <div key={place.placeId} style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardName}>{place.name}</span>
            </div>
            {place.address && <p style={s.cardAddress}>{place.address}</p>}
            <div style={s.cardMeta}>
              <span style={s.distance}><MapPin size={13} color="#A78BFA" /> {formatDistance(place.distance)}</span>
              {place.openingHours && <span style={s.hours}>🕒 {place.openingHours}</span>}
            </div>
            <div style={s.cardActions}>
              <button style={s.actionBtnGhost} disabled title="Em breve — conversar direto com o estabelecimento">
                <MessageCircle size={14} /> Conversar
              </button>
              {place.phone ? (
                <a style={s.actionBtn} href={`tel:${place.phone.replace(/\D/g, '')}`}>
                  <Phone size={14} /> Ligar
                </a>
              ) : (
                <button style={s.actionBtnGhost} disabled title="Telefone não disponível">
                  <Phone size={14} /> Ligar
                </button>
              )}
              <a style={s.actionBtn} href={directionsUrl(place)} target="_blank" rel="noopener noreferrer">
                <Navigation size={14} /> Como chegar
              </a>
            </div>
            {place.website && (
              <a style={s.websiteLink} href={place.website} target="_blank" rel="noopener noreferrer">
                <Globe size={12} /> Visitar site
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const s = {
  page: { flex: 1, display: 'flex', flexDirection: 'column', background: '#16161F', height: '100%', overflowY: 'auto' },
  header: { padding: '20px 20px 12px' },
  title: { color: '#F0F0FF', fontSize: '20px', fontWeight: 700, margin: 0 },
  subtitle: { color: '#606080', fontSize: '13px', margin: '4px 0 0' },
  searchBar: { display: 'flex', alignItems: 'center', gap: '10px', margin: '0 16px 12px', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
  searchInput: { flex: 1, background: 'none', border: 'none', outline: 'none', color: '#F0F0FF', fontSize: '14px' },
  categories: { display: 'flex', gap: '8px', overflowX: 'auto', padding: '0 16px 16px', flexWrap: 'nowrap' },
  categoryChip: { display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, padding: '8px 14px', borderRadius: '20px', border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(124,58,237,0.1)', color: '#D8D8F0', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' },
  categoryEmoji: { fontSize: '15px' },
  results: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 16px 20px' },
  notice: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#F0A0A0', fontSize: '13px' },
  centered: { display: 'flex', justifyContent: 'center', padding: '30px 0' },
  card: { background: '#1E1E2E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '14px' },
  cardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' },
  cardName: { color: '#F0F0FF', fontSize: '15px', fontWeight: 600 },
  cardAddress: { color: '#606080', fontSize: '12px', margin: '0 0 8px', lineHeight: 1.4 },
  cardMeta: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px', flexWrap: 'wrap' },
  distance: { display: 'flex', alignItems: 'center', gap: '4px', color: '#A78BFA', fontSize: '13px' },
  hours: { color: '#606080', fontSize: '12px' },
  cardActions: { display: 'flex', gap: '8px' },
  actionBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '9px', background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', border: 'none', borderRadius: '9px', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' },
  actionBtnGhost: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '9px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9px', color: '#606080', fontSize: '12px', fontWeight: 600, cursor: 'not-allowed' },
  websiteLink: { display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px', color: '#606080', fontSize: '12px', textDecoration: 'underline' }
}
