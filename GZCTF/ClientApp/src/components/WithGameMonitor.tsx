import api, { Role } from '@Api'
import React, { FC, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Group, LoadingOverlay, Stack, Tabs, useMantineTheme } from '@mantine/core'
import { mdiFlag, mdiLightningBolt } from '@mdi/js'
import { Icon } from '@mdi/react'
import WithGameTab from './WithGameTab'
import WithNavBar from './WithNavbar'
import WithRole from './WithRole'

const pages = [
  { icon: mdiLightningBolt, title: '事件监控', path: 'events' },
  { icon: mdiFlag, title: '提交记录', path: 'submissions' },
]

interface WithGameMonitorProps extends React.PropsWithChildren {
  isLoading?: boolean
}

const getTab = (path: string) => pages.find((page) => path.endsWith(page.path))

const WithGameMonitor: FC<WithGameMonitorProps> = ({ children, isLoading }) => {
  const { id } = useParams()
  const numId = parseInt(id ?? '-1')

  const navigate = useNavigate()
  const location = useLocation()
  const theme = useMantineTheme()
  const [activeTab, setActiveTab] = useState(getTab(location.pathname)?.path ?? pages[0].path)

  const { data: game } = api.game.useGameGames(numId, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  })

  useEffect(() => {
    const tab = getTab(location.pathname)
    if (tab) {
      setActiveTab(tab.path ?? '')
    } else {
      navigate(pages[0].path)
    }
  }, [location])

  return (
    <WithNavBar width="90%">
      <WithRole requiredRole={Role.Monitor}>
        <WithGameTab isLoading={!game} game={game} status={game?.status}>
          <Group position="apart" align="flex-start">
            <Tabs
              orientation="vertical"
              value={activeTab}
              onTabChange={(value) => navigate(`/games/${id}/monitor/${value}`)}
              styles={{
                root: {
                  width: '8rem',
                },
              }}
            >
              <Tabs.List>
                {pages.map((page) => (
                  <Tabs.Tab
                    key={page.path}
                    icon={<Icon path={page.icon} size={1} />}
                    value={page.path}
                  >
                    {page.title}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
            <Stack style={{ width: 'calc(100% - 9rem)', position: 'relative' }}>
              <LoadingOverlay
                visible={isLoading ?? false}
                overlayOpacity={1}
                overlayColor={
                  theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.white[2]
                }
              />
              {children}
            </Stack>
          </Group>
        </WithGameTab>
      </WithRole>
    </WithNavBar>
  )
}

export default WithGameMonitor