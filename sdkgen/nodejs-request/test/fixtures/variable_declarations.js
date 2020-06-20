module.exports = [{
  string: '{{var1}}/xyz/{{',
  replaceValue: '\' + self.variables.var1 + \'/xyz/{{'
},
{
  string: '{{var1}}/xyz/{{var2}}',
  replaceValue: '\' + self.variables.var1 + \'/xyz/\' + self.variables.var2 + \''
},
{
  string: '{{  {{}}/xyz/{{var2}}',
  replaceValue: '{{  {{}}/xyz/{{var2}}'
}, {
  string: '{{  \n{{}}/xyz/{{var2}}',
  replaceValue: '{{  \n{{}}/xyz/{{var2}}'
}
];
