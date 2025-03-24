const React = require('react');
const { View, Text } = require('react-native');

const Icon = ({ name, size, color, style, testID }) => (
  <View style={style} testID={testID}>
    <Text>{name}</Text>
  </View>
);

module.exports = {
  Ionicons: Icon,
};
