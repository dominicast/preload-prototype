import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'

function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Hero section */}
      <Box
        component="section"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          flexGrow: 1,
          py: { xs: 4, md: 6 },
          px: 2,
        }}
      >
        <Box sx={{ position: 'relative', width: 170, height: 179 }}>
          <Box
            component="img"
            src={heroImg}
            alt=""
            sx={{ width: 170, height: 179, position: 'relative', zIndex: 0 }}
          />
          <Box
            component="img"
            src={reactLogo}
            alt="React logo"
            sx={{
              position: 'absolute',
              insetInline: 0,
              mx: 'auto',
              zIndex: 1,
              top: 34,
              height: 28,
              transform:
                'perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg) scale(1.4)',
            }}
          />
          <Box
            component="img"
            src={viteLogo}
            alt="Vite logo"
            sx={{
              position: 'absolute',
              insetInline: 0,
              mx: 'auto',
              zIndex: 0,
              top: 107,
              height: 26,
              width: 'auto',
              transform:
                'perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg) scale(0.8)',
            }}
          />
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Get started
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Edit <Box component="code">src/App.tsx</Box> and save to test{' '}
            <Box component="code">HMR</Box>
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => setCount((c) => c + 1)}
          sx={{ mb: 3 }}
        >
          Count is {count}
        </Button>
      </Box>

      <Divider />

      {/* Next Steps section */}
      <Box
        component="section"
        sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}
      >
        {/* Documentation */}
        <Box
          sx={{
            flex: 1,
            p: { xs: '24px 20px', md: 4 },
            borderRight: { xs: 'none', md: '1px solid' },
            borderBottom: { xs: '1px solid', md: 'none' },
            borderColor: 'divider',
          }}
        >
          <svg role="presentation" aria-hidden="true" style={{ width: 22, height: 22, marginBottom: 16 }}>
            <use href="/icons.svg#documentation-icon" />
          </svg>
          <Typography variant="h6" component="h2" gutterBottom>
            Documentation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your questions, answered
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
            {[
              { href: 'https://vite.dev/', img: viteLogo, label: 'Explore Vite' },
              { href: 'https://react.dev/', img: reactLogo, label: 'Learn more' },
            ].map(({ href, img, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                underline="none"
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 1.5, py: 0.75, borderRadius: 1.5,
                  bgcolor: 'action.hover', color: 'text.primary',
                  '&:hover': { boxShadow: 2 },
                }}
              >
                <Box component="img" src={img} alt="" sx={{ height: 18 }} />
                {label}
              </Link>
            ))}
          </Stack>
        </Box>

        {/* Social */}
        <Box sx={{ flex: 1, p: { xs: '24px 20px', md: 4 } }}>
          <svg role="presentation" aria-hidden="true" style={{ width: 22, height: 22, marginBottom: 16 }}>
            <use href="/icons.svg#social-icon" />
          </svg>
          <Typography variant="h6" component="h2" gutterBottom>
            Connect with us
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join the Vite community
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: 'wrap', gap: 1 }}>
            {[
              { href: 'https://github.com/vitejs/vite', icon: 'github-icon', label: 'GitHub' },
              { href: 'https://chat.vite.dev/', icon: 'discord-icon', label: 'Discord' },
              { href: 'https://x.com/vite_js', icon: 'x-icon', label: 'X.com' },
              { href: 'https://bsky.app/profile/vite.dev', icon: 'bluesky-icon', label: 'Bluesky' },
            ].map(({ href, icon, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                underline="none"
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 1.5, py: 0.75, borderRadius: 1.5,
                  bgcolor: 'action.hover', color: 'text.primary',
                  '&:hover': { boxShadow: 2 },
                }}
              >
                <svg role="presentation" aria-hidden="true" style={{ height: 18, width: 18 }}>
                  <use href={`/icons.svg#${icon}`} />
                </svg>
                {label}
              </Link>
            ))}
          </Stack>
        </Box>
      </Box>

      <Divider />
      <Box sx={{ height: { xs: 48, md: 88 } }} />
    </Box>
  )
}

export default HomePage