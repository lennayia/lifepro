import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  Grid,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import {
  ArrowLeft,
  HelpCircle,
  BookOpen,
  Video,
  Mail,
  ChevronDown,
  CheckCircle,
  Heart,
  FileDown,
  Search,
  BarChart3,
  Settings,
} from 'lucide-react';

const HelpPage = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState('faq1');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const quickLinks = [
    {
      icon: <BookOpen size={32} />,
      title: 'Začínáme',
      description: 'Jak začít s LifePro',
      action: () => setExpanded('faq1'),
      color: '#1976d2',
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Vyplňování dotazníku',
      description: 'Jak odpovídat na otázky',
      action: () => setExpanded('faq2'),
      color: '#2e7d32',
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Výsledky a statistiky',
      description: 'Jak číst své výsledky',
      action: () => setExpanded('faq5'),
      color: '#ed6c02',
    },
    {
      icon: <FileDown size={32} />,
      title: 'Export do PDF',
      description: 'Jak stáhnout výsledky',
      action: () => setExpanded('faq6'),
      color: '#9c27b0',
    },
  ];

  const faqs = [
    {
      id: 'faq1',
      question: 'Jak začít s LifePro?',
      answer: (
        <>
          <Typography paragraph>
            <strong>Krok 1:</strong> Po přihlášení se dostanete na Dashboard, kde vidíte
            přehled vašeho pokroku.
          </Typography>
          <Typography paragraph>
            <strong>Krok 2:</strong> Klikněte na "Dotazník" v navigaci nebo na "Začít vyplňovat"
            na Dashboardu.
          </Typography>
          <Typography paragraph>
            <strong>Krok 3:</strong> Vyberte kategorii, která vás zajímá (např. Hodnoty, Dovednosti,
            Kariéra).
          </Typography>
          <Typography paragraph>
            <strong>Krok 4:</strong> Odpovězte na otázky zaškrtnutím checkboxu. Odpovědi se
            automaticky ukládají.
          </Typography>
          <Typography>
            <strong>Tip:</strong> Nemusíte dokončit vše najednou. Můžete se kdykoli vrátit a
            pokračovat tam, kde jste skončili.
          </Typography>
        </>
      ),
    },
    {
      id: 'faq2',
      question: 'Jak funguje vyplňování dotazníku?',
      answer: (
        <>
          <Typography paragraph>
            <strong>Auto-save:</strong> Každá odpověď se automaticky uloží do databáze. Nemusíte
            nic ukládat ručně.
          </Typography>
          <Typography paragraph>
            <strong>Checkboxy:</strong> Zaškrtněte checkbox u otázky, pokud se vás týká nebo s ní
            souhlasíte.
          </Typography>
          <Typography paragraph>
            <strong>Oblíbené:</strong> Klikněte na ❤️ ikonu u důležitých otázek, které chcete mít
            označené jako oblíbené.
          </Typography>
          <Typography paragraph>
            <strong>Progress bar:</strong> Nahoře vidíte svůj pokrok v dané kategorii (např. 45%).
          </Typography>
          <Typography>
            <strong>Sekce:</strong> Otázky jsou rozdělené do sekcí pro lepší přehlednost.
          </Typography>
        </>
      ),
    },
    {
      id: 'faq3',
      question: 'Co znamenají oblíbené otázky?',
      answer: (
        <>
          <Typography paragraph>
            Oblíbené otázky (označené ❤️) jsou ty, které považujete za obzvlášť důležité nebo
            relevantní pro váš osobní rozvoj.
          </Typography>
          <Typography paragraph>
            <strong>Použití:</strong>
            <br />
            • Rychlý přístup k vašim klíčovým tématům
            <br />
            • Zobrazení v sekci "Oblíbené" na stránce Výsledky
            <br />
            • Zvýraznění v PDF exportu
            <br />• Filtrování pomocí filtru "Oblíbené" v dotazníku
          </Typography>
          <Typography>
            <strong>Tip:</strong> Označte si 10-20 otázek, které nejlépe reprezentují vaše hodnoty
            a priority.
          </Typography>
        </>
      ),
    },
    {
      id: 'faq4',
      question: 'Jak používat vyhledávání a filtry?',
      answer: (
        <>
          <Typography paragraph>
            <strong>Vyhledávání:</strong> V detailu kategorie najdete vyhledávací pole. Zadejte
            klíčové slovo (např. "kariéra") a zobrazí se pouze otázky obsahující toto slovo.
          </Typography>
          <Typography paragraph>
            <strong>Filtry:</strong>
            <br />
            • <strong>Vše</strong> - Zobrazí všechny otázky v kategorii
            <br />
            • <strong>Nezodpovězené</strong> - Pouze otázky, na které jste ještě neodpověděli
            <br />• <strong>Oblíbené</strong> - Pouze otázky označené ❤️
          </Typography>
          <Typography>
            <strong>Kombinace:</strong> Můžete kombinovat vyhledávání a filtry. Např. vyhledat
            "zdraví" a zapnout filtr "Nezodpovězené".
          </Typography>
        </>
      ),
    },
    {
      id: 'faq5',
      question: 'Jak číst výsledky a statistiky?',
      answer: (
        <>
          <Typography paragraph>
            <strong>Celkové statistiky:</strong> Na stránce Výsledky vidíte 4 karty:
            <br />
            • Počet zodpovězených otázek z celkového počtu
            <br />
            • Počet dokončených kategorií
            <br />
            • Počet oblíbených otázek
            <br />• Celkový pokrok v %
          </Typography>
          <Typography paragraph>
            <strong>Pokrok po kategoriích:</strong> Každá kategorie má svůj progress bar
            zobrazujíci, kolik % jste dokončili.
          </Typography>
          <Typography paragraph>
            <strong>Grafy:</strong>
            <br />
            • <strong>Radar graf</strong> - Vizualizuje váš pokrok napříč všemi oblastmi života
            <br />• <strong>Sloupcový graf</strong> - Porovnává kategorie s barevným kódováním
            podle pokroku
          </Typography>
          <Typography>
            <strong>Seznam oblíbených:</strong> Zobrazuje všechny otázky označené ❤️ s informací o
            kategorii a sekci.
          </Typography>
        </>
      ),
    },
    {
      id: 'faq6',
      question: 'Jak exportovat výsledky do PDF?',
      answer: (
        <>
          <Typography paragraph>
            <strong>Krok 1:</strong> Přejděte na stránku "Výsledky" (v navigaci).
          </Typography>
          <Typography paragraph>
            <strong>Krok 2:</strong> V pravém horním rohu klikněte na tlačítko "Stáhnout PDF".
          </Typography>
          <Typography paragraph>
            <strong>Krok 3:</strong> PDF se automaticky stáhne do vašich stažených souborů.
          </Typography>
          <Typography paragraph>
            <strong>Obsah PDF:</strong>
            <br />
            • Titulní strana s vaším jménem a datem
            <br />
            • Celkové statistiky (tabulka)
            <br />
            • Přehled všech kategorií s progress bary
            <br />
            • Seznam zodpovězených otázek po sekcích
            <br />• Seznam oblíbených otázek
          </Typography>
          <Typography>
            <strong>Tip:</strong> PDF je perfektní pro sdílení s mentorem, koučem nebo pro vlastní
            archivaci.
          </Typography>
        </>
      ),
    },
    {
      id: 'faq7',
      question: 'Co je Admin rozhraní a jak ho používat?',
      answer: (
        <>
          <Typography paragraph>
            <strong>Přístup:</strong> Admin rozhraní najdete na adrese /admin (dostupné pro
            administrátory).
          </Typography>
          <Typography paragraph>
            <strong>Funkce:</strong>
            <br />
            • <strong>Kategorie:</strong> Vytváření, úprava a mazání kategorií. Auto-generování
            slug.
            <br />
            • <strong>Sekce:</strong> Správa sekcí v rámci kategorií.
            <br />• <strong>Otázky:</strong> Přidávání a úprava otázek s filtrováním podle
            kategorie.
          </Typography>
          <Typography paragraph>
            <strong>Validace:</strong> Při vytváření kategorie se automaticky generuje slug z
            názvu. Můžete ho upravit ručně.
          </Typography>
          <Typography>
            <strong>Publikování:</strong> Každý prvek (kategorie/sekce/otázka) může být publikován
            nebo skryt. Skryté prvky se nezobrazují uživatelům.
          </Typography>
        </>
      ),
    },
    {
      id: 'faq8',
      question: 'Jsou moje data bezpečná?',
      answer: (
        <>
          <Typography paragraph>
            <strong>Ano, vaše data jsou chráněna:</strong>
          </Typography>
          <Typography paragraph>
            • <strong>Autentizace:</strong> Supabase Auth s email verifikací
            <br />
            • <strong>Row Level Security:</strong> Každý uživatel vidí pouze svá data
            <br />
            • <strong>HTTPS:</strong> Všechna komunikace je šifrovaná
            <br />• <strong>PostgreSQL:</strong> Enterprise-grade databáze
          </Typography>
          <Typography paragraph>
            <strong>Přístup k datům:</strong> Pouze vy máte přístup ke svým odpovědím. Administrátor
            může spravovat kategorie a otázky, ale nevidí vaše odpovědi.
          </Typography>
          <Typography>
            <strong>Zálohování:</strong> Supabase automaticky zálohuje databázi každých 24 hodin.
          </Typography>
        </>
      ),
    },
    {
      id: 'faq9',
      question: 'Mohu změnit nebo smazat své odpovědi?',
      answer: (
        <>
          <Typography paragraph>
            <strong>Změna odpovědí:</strong> Ano! Kdykoli se můžete vrátit do kategorie a změnit
            své odpovědi. Jednoduše odškrtněte nebo zaškrtněte checkbox.
          </Typography>
          <Typography paragraph>
            <strong>Odstranění oblíbené:</strong> Klikněte znovu na ❤️ ikonu pro odstranění z
            oblíbených.
          </Typography>
          <Typography paragraph>
            <strong>Smazání všech dat:</strong> V sekci Profil můžete smazat svůj účet a všechna
            data.
          </Typography>
          <Typography>
            <strong>Auto-save:</strong> Všechny změny se ukládají okamžitě, takže nemusíte klikat
            na "Uložit".
          </Typography>
        </>
      ),
    },
    {
      id: 'faq10',
      question: 'Jaký je rozdíl mezi Dashboard a Výsledky?',
      answer: (
        <>
          <Typography paragraph>
            <strong>Dashboard:</strong>
            <br />
            • Rychlý přehled základních statistik
            <br />
            • 4 karty s klíčovými metrikami
            <br />
            • Tlačítka pro rychlý přístup k dotazníku a výsledkům
            <br />• Domovská stránka po přihlášení
          </Typography>
          <Typography paragraph>
            <strong>Výsledky:</strong>
            <br />
            • Detailní statistiky a analýzy
            <br />
            • Pokrok po jednotlivých kategoriích
            <br />
            • Grafy a vizualizace (Radar, Bar chart)
            <br />
            • Seznam oblíbených odpovědí
            <br />• Export do PDF
          </Typography>
          <Typography>
            <strong>Kdy použít:</strong> Dashboard pro rychlý náhled, Výsledky pro hloubkovou
            analýzu.
          </Typography>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Zpět na dashboard
        </Button>

        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <HelpCircle size={40} color="#1976d2" />
          <Box>
            <Typography variant="h3" gutterBottom>
              Nápověda & FAQ
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vše, co potřebujete vědět o používání LifePro
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Quick Links */}
      <Box mb={5}>
        <Typography variant="h5" gutterBottom mb={3}>
          Rychlé odkazy
        </Typography>
        <Grid container spacing={3}>
          {quickLinks.map((link, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={link.action}
              >
                <Box sx={{ color: link.color, mb: 2 }}>{link.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {link.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {link.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* FAQ Section */}
      <Box mb={5}>
        <Typography variant="h5" gutterBottom mb={3}>
          Často kladené otázky
        </Typography>

        {faqs.map((faq) => (
          <Accordion
            key={faq.id}
            expanded={expanded === faq.id}
            onChange={handleAccordionChange(faq.id)}
            sx={{ mb: 1 }}
          >
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="h6" fontWeight={600}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ pt: 1 }}>{faq.answer}</Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Contact Section */}
      <Paper sx={{ p: 4, bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
        <Mail size={48} style={{ marginBottom: 16 }} />
        <Typography variant="h5" gutterBottom>
          Nenašli jste odpověď?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
          Kontaktujte nás na support@lifepro.cz nebo vytvořte issue na GitHubu
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'grey.100',
            },
          }}
          onClick={() => (window.location.href = 'mailto:support@lifepro.cz')}
        >
          Kontaktovat podporu
        </Button>
      </Paper>

      {/* Footer Info */}
      <Box mt={4} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          LifePro v2.0.0 • Poslední aktualizace: {new Date().toLocaleDateString('cs-CZ')}
        </Typography>
      </Box>
    </Container>
  );
};

export default HelpPage;
