import spawn from 'spawncommand'

(async () => {
  const { promise } = spawn('node_modules/google-closure-library/closure/bin/calcdeps.py', [
    '-i', 'form/files/script.js',
    '-p', 'node_modules/google-closure-library/', '-o', 'list',
  ])
  const { stdout, stderr, code } = await promise
  if (code) {
    throw new Error(stderr)
  }
  const files = stdout.split('\n').filter(a=>a)
  const args = [
    '-jar', 'node_modules/google-closure-compiler-java/compiler.jar',
    '--js', 'form/files/upload.js',
    '--js_module_root', 'form/files',
    '--compilation_level', 'ADVANCED',
    '--externs', 'calcdeps/externs.js',
    '--js_output_file', 'form/files/script-closure.js',
    '--create_source_map', '%outname%.map',
    '--source_map_include_content',
    ...files.reduce((a, f) => [...a, '--js', f], []),
  ]
  const { promise: promise2 } = spawn('java', args)
  const { stdout: o, stderr: e, code: c } = await promise2
  if (c) throw new Error(e)
  console.log(o)
})()