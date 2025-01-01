import Colors from '@/constants/Colors';
import { useLocale } from '@/providers/LocaleProvider';
import { AntDesign } from '@expo/vector-icons';
import { ReactNode, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';

type sectionType = {
  title: string;
  content: ReactNode;
  titleIcon?: (isActive: boolean) => ReactNode;
};

type CollapsibleViewPropType = {
  title?: string;
  sections: sectionType[];
};

const Accordian = ({ title, sections }: CollapsibleViewPropType) => {
  const [activeSections, setActiveSections] = useState([]);

  const { t } = useLocale()

  const renderHeader = (
    section: sectionType,
    index: number,
    isActive: boolean,
    sections: sectionType[]
  ) => {
    const rotateRight = {
      from: {
        transform: [
          {
            rotate: '0deg',
          },
        ],
      },
      to: {
        transform: [
          {
            rotate: '90deg',
          },
        ],
      },
    };

    const rotateLeft = {
      from: {
        transform: [
          {
            rotate: '90deg',
          },
        ],
      },
      to: {
        transform: [
          {
            rotate: '0deg',
          },
        ],
      },
    };
    return (
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: 'white',
            borderTopWidth: index !== 0 ? 2 : 0,
          },
        ]}
      >
        <View style={styles.headerCotentContainer}>
          {section.titleIcon && section.titleIcon(isActive)}
          <Animatable.Text
            duration={500}
            transition='color'
            style={[
              styles.headerText,
              {
                color: isActive ? Colors.light.tint : 'gray',
                fontWeight: isActive ? '600' : '400',
              },
            ]}
          >
            {t(section.title)}
          </Animatable.Text>
          <Animatable.View
            duration={500}
            animation={isActive ? rotateRight : rotateLeft}
            style={{ marginLeft: 'auto' }}
          >
            <AntDesign
              size={13}
              name='right'
              style={{ marginTop: 1 }}
              color={isActive ? Colors.light.tint : 'gray'}
            />
          </Animatable.View>
        </View>
        {isActive && (
          <Animatable.View
            duration={500}
            easing='ease-out'
            animation={isActive ? 'zoomIn' : 'zoomOut'}
            style={styles.horizontalSectionLine}
          />
        )}
      </View>
    );
  };

  const renderContent = (
    section: sectionType,
    index: number,
    isActive: boolean,
    sections: sectionType[]
  ) => {
    return (
      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: 'white',
          },
        ]}
      >
        <Animatable.View
          duration={isActive ? 300 : 1500}
          easing='ease-in-out'
          animation={isActive ? 'zoomIn' : 'zoomOut'}
        >
          {section.content}
        </Animatable.View>
      </View>
    );
  };

  const updateSections = (activeSections: []) => {
    setActiveSections(activeSections);
  };

  return (
    <View style={styles.accordionContainer}>
      {!!title && <Text>{title}</Text>}
      {!!sections && (
        <Accordion
          sections={sections}
          activeSections={activeSections}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={updateSections}
          easing='easeInOut'
          duration={400}
          underlayColor={Colors.light.tint}
          sectionContainerStyle={{ minWidth: '100%' }}
        />
      )}
    </View>
  );
};

export default Accordian;

const styles = StyleSheet.create({
  accordionContainer: {
    width: '100%',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderColor: '#f1f1f1',
  },
  headerText: {
    fontSize: 17,
  },
  headerCotentContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  horizontalSectionLine: {
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    marginTop: 15,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
});
