import * as React from 'react'
import { Meta } from '@storybook/react'
import { Octahedron } from '@react-three/drei'
import { Setup } from '../../.storybook/Setup'
import { CameraControls } from './index'

export default {
  title: 'CameraControls',
  component: CameraControls,
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
