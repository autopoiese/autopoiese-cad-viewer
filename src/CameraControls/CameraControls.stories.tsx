import * as React from 'react'
import { Meta } from '@storybook/react'
import {
  Octahedron,
  PerspectiveCamera,
  OrthographicCamera
} from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Setup } from '../../.storybook/Setup'
import { CameraControls } from './index'

export default {
  title: 'CameraControls',
  component: CameraControls,
  argTypes: {
    cameraType: {
      control: {
        type: 'select'
      },
      options: ['orthographic', 'perspective']
    }
  },
  decorators: [
    (story) => (
      <Setup {...{ controls: false }}>
        <Octahedron>
          <meshNormalMaterial />
        </Octahedron>
        {story()}
      </Setup>
    )
  ]
} as Meta

const Template = (args) => <CameraControls {...args} />

export const DefaultCameraControlsStory = Template.bind({})
DefaultCameraControlsStory.story = { name: 'Default' }

export const DollyToCursorStory = Template.bind({})
DollyToCursorStory.story = { name: 'Dolly To Cursor' }
DollyToCursorStory.args = {
  dollyToCursor: true
}

export const FitInStory = Template.bind({})
FitInStory.story = { name: 'Fit In' }
FitInStory.args = {
  fitInitial: true
}

const SwitchCameraComponent: React.FC<{
  cameraType: 'orthographic' | 'perspective'
}> = ({ cameraType }) => {
  return (
    <React.Fragment>
      <OrthographicCamera
        {...{ makeDefault: cameraType === 'orthographic', position: [5, 5, 5] }}
      />
      <PerspectiveCamera
        {...{ makeDefault: cameraType === 'perspective', position: [5, 5, 5] }}
      />
      <CameraControls />
    </React.Fragment>
  )
}
const SwitchCameraStoryTemplate = (args) => {
  return <SwitchCameraComponent {...args} />
}

export const SwitchCameraStory = SwitchCameraStoryTemplate.bind({})
SwitchCameraStory.story = { name: 'Switch Camera Type' }
