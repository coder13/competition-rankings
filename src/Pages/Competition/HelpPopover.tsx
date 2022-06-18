import { Popover, Typography, IconButton, IconButtonProps, PopoverProps } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { PropsWithChildren, useState } from 'react';
import { TypographyProps } from '@mui/system';

interface HelpPopoverProps extends PropsWithChildren {
  iconButtonProps?: IconButtonProps;
  popoverProps?: PopoverProps;
  typographyProps?: TypographyProps;
}

export default function HelpPopover({
  iconButtonProps,
  popoverProps,
  typographyProps,
  children,
}: HelpPopoverProps) {
  const [helpAnchor, setHelpAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <IconButton
        color="inherit"
        {...iconButtonProps}
        onClick={(e) => setHelpAnchor(e.currentTarget)}
      >
        <HelpIcon />
      </IconButton>
      <Popover
        open={!!helpAnchor}
        anchorEl={helpAnchor}
        onClose={() => setHelpAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        {...popoverProps}
      >
        <Typography
          style={{ paddingLeft: '.5em', paddingRight: '.5em' }}
          fontSize="small"
          {...typographyProps}
        >
          {children}
        </Typography>
      </Popover>
    </>
  );
}
