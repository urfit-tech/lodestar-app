import PrimaryProgramPageContent from './Primary/PrimaryProgramPageContent'
import SecondaryProgramContent from './Secondary/SecondaryProgramPageContent'

const ProgramPageContent: React.FC<{ variant: string | null | undefined }> = ({ variant }) => {
  switch (variant) {
    case 'primary':
      return <PrimaryProgramPageContent />
    case 'secondary':
      return <SecondaryProgramContent />
    default:
      return <PrimaryProgramPageContent />
  }
}

export default ProgramPageContent
