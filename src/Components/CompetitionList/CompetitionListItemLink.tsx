import React from 'react';
import { Link } from 'react-router-dom';
import FlagIconFactory from 'react-flag-icon-css';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import { Competition } from 'Services';

const FlagIcon = FlagIconFactory(React, { useCssModules: false });

interface CompetitionListItemLinkProps extends Competition {}

export default function CompetitionListItemLink({
  id,
  name,
  country_iso2,
  start_date,
}: CompetitionListItemLinkProps) {
  return (
    <ListItem button component={Link} to={`/competitions/${id}`}>
      <ListItemIcon>
        {RegExp('(x|X)', 'g').test(country_iso2.toLowerCase()) ? (
          <PublicIcon />
        ) : (
          <FlagIcon code={country_iso2.toLowerCase()} size="lg" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={name}
        secondary={new Date(start_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      />
    </ListItem>
  );
}
