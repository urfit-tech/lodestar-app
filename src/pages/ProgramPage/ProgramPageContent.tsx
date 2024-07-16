import React from 'react'
import PrimaryProgramPageContent from './Primary/PrimaryProgramPageContent'
import SecondaryProgramContent from './Secondary/SecondaryProgramPageContent'

class ProgramPageContentFactory {
  private readonly _type: string

  constructor(layoutTemplateVariant?: string | null) {
    this._type = layoutTemplateVariant || 'default'
  }

  public createContent(): JSX.Element {
    const ContentComponent = this._getContentComponent()
    return <ContentComponent />
  }

  private _getContentComponent(): React.ComponentType<{}> {
    const contentMap: Record<string, React.ComponentType<{}>> = {
      secondary: SecondaryProgramContent,
      default: PrimaryProgramPageContent,
    }
    return contentMap[this._type] || contentMap['default']
  }
}

const ProgramPageContent: React.FC<{ layoutTemplateVariant: string | null | undefined }> = ({
  layoutTemplateVariant,
}) => {
  const contentfactory = new ProgramPageContentFactory(layoutTemplateVariant)
  return contentfactory.createContent()
}

export default ProgramPageContent
