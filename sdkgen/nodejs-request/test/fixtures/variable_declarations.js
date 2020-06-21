module.exports = [{
  string: '{{var1}}/xyz/{{',
  replaceValue: '\' + self.variables.var1 + \'/xyz/{{'
},
{
  string: '{{var1}}/xyz/{{var2}}',
  replaceValue: '\' + self.variables.var1 + \'/xyz/\' + self.variables.var2 + \''
},
{
  string: '{{  {}}/xyz/{ var2}}',
  replaceValue: '{{  {}}/xyz/{ var2}}'
},
{
  string: '{{  \n{}}/xyz/{{var2\n}',
  replaceValue: '{{  \n{}}/xyz/{{var2\n}'
},
{
  string: '{{\n{/zyx/\n{{var1}}{{var2}}}}',
  replaceValue: '{{\n{/zyx/\n\' + self.variables.var1 + \'\' + self.variables.var2 + \'}}'
},
{
  string: '{{\nvar2}}',
  replaceValue: '{{\nvar2}}'
},
{
  string: '{{{var1}}}',
  replaceValue: '{\' + self.variables.var1 + \'}'
},
{
  string: '{{{var1}}{{var2}}}',
  replaceValue: '{\' + self.variables.var1 + \'\' + self.variables.var2 + \'}'
},
{
  string: '{\n"test":\'{{var1}}\',\n"test2":\'{{var2}}\'\n}',
  replaceValue: '{\n"test":\'\' + self.variables.var1 + \'\',\n"test2":\'\' + self.variables.var2 + \'\'\n}'
}
];
